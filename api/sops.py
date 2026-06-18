"""
The SLG Team — SOP store (Vercel Python serverless function).

GET  /api/sops                      -> { "sops": [...] }
POST /api/sops  { "action": ... }   -> create / update / delete / seed

Storage: Vercel KV (Upstash Redis) via its REST API when the KV_* /
UPSTASH_* env vars are present; otherwise a local JSON file (used in
preview / dev). The frontend seeds the store from its bundled SOP data
on first load, so there is only one copy of the seed content.
"""
import json
import os
import re
import threading
import urllib.request

KEY = "slg_sops_v1"
LOCAL_STORE = os.environ.get("SLG_LOCAL_STORE", "/tmp/slg_sops_store.json")
# Serializes read-modify-write within a single process (the dev server's
# threaded handler). Harmless in serverless where each call is isolated.
_LOCK = threading.Lock()


# ── storage layer ────────────────────────────────────────────────────────────
# Priority: a Redis connection string (REDIS_URL / KV_URL — what Vercel's Redis
# integration injects) → an Upstash REST endpoint (KV_REST_API_*) → a local
# JSON file (dev / preview).
def _redis_url():
    return os.environ.get("REDIS_URL") or os.environ.get("KV_URL")


def _kv_creds():
    url = os.environ.get("KV_REST_API_URL") or os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("KV_REST_API_TOKEN") or os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    if url and token:
        return url.rstrip("/"), token
    return None, None


def _storage_mode():
    if _redis_url():
        return "redis"
    if _kv_creds()[0]:
        return "kv-rest"
    return "local"


def _redis_client():
    import redis  # lazy — only imported when a Redis URL is configured

    return redis.from_url(_redis_url(), socket_timeout=5, socket_connect_timeout=5)


def _kv_cmd(args):
    url, token = _kv_creds()
    req = urllib.request.Request(
        url,
        data=json.dumps(args).encode("utf-8"),
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8")).get("result")


def _decode(raw):
    if raw is None:
        return []
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8")
    try:
        return json.loads(raw)
    except (ValueError, TypeError):
        return []


def _read_all():
    if _redis_url():
        return _decode(_redis_client().get(KEY))
    if _kv_creds()[0]:
        return _decode(_kv_cmd(["GET", KEY]))
    try:
        with open(LOCAL_STORE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return []


def _write_all(sops):
    payload = json.dumps(sops)
    if _redis_url():
        _redis_client().set(KEY, payload)
    elif _kv_creds()[0]:
        _kv_cmd(["SET", KEY, payload])
    else:
        # Atomic write (temp file + replace) so a concurrent reader never sees
        # a half-written/truncated file.
        try:
            tmp = LOCAL_STORE + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                f.write(payload)
            os.replace(tmp, LOCAL_STORE)
        except OSError:
            pass
    return sops


# ── helpers ──────────────────────────────────────────────────────────────────
def _slugify(s):
    out = re.sub(r"[^a-z0-9]+", "-", (s or "sop").lower()).strip("-")
    return out[:60] or "sop"


def _unique_slug(base, existing):
    have = {x.get("slug") for x in existing}
    slug, i = base, 2
    while slug in have:
        slug, i = base + "-" + str(i), i + 1
    return slug


# ── operations ───────────────────────────────────────────────────────────────
def list_sops():
    return _read_all()


def seed_sops(sops):
    """Populate the store from the frontend's bundled data — only if empty."""
    with _LOCK:
        current = _read_all()
        if current:
            return current
        out = []
        for raw in sops or []:
            s = dict(raw)
            if not s.get("slug"):
                s["slug"] = _unique_slug(_slugify(s.get("title", "sop")), out)
            out.append(s)
        return _write_all(out)


def add_sop(sop):
    s = dict(sop or {})
    if not s.get("title"):
        raise ValueError("A title is required.")
    with _LOCK:
        sops = _read_all()
        s["slug"] = _unique_slug(_slugify(s.get("title")), sops)
        if not s.get("code"):
            s["code"] = "NEW"
        s.setdefault("status", "Live")
        sops.append(s)
        _write_all(sops)
        return s


def update_sop(sop):
    slug = (sop or {}).get("slug")
    if not slug:
        raise ValueError("Cannot update a SOP without a slug.")
    with _LOCK:
        sops = _read_all()
        for i, x in enumerate(sops):
            if x.get("slug") == slug:
                merged = dict(x)
                merged.update(sop)
                sops[i] = merged
                _write_all(sops)
                return merged
    raise ValueError("SOP not found: " + str(slug))


def delete_sop(slug):
    with _LOCK:
        sops = _read_all()
        remaining = [x for x in sops if x.get("slug") != slug]
        _write_all(remaining)
        return {"deleted": slug, "remaining": len(remaining)}


def dispatch(body):
    action = (body or {}).get("action")
    if action == "seed":
        return {"sops": seed_sops(body.get("sops") or [])}
    if action == "add":
        return {"sop": add_sop(body.get("sop") or {})}
    if action == "update":
        return {"sop": update_sop(body.get("sop") or {})}
    if action == "delete":
        return delete_sop(body.get("slug"))
    raise ValueError("Unknown action: " + str(action))


# ── Vercel serverless entrypoint (top-level `handler` required) ───────────────
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        try:
            self._send(200, {"sops": list_sops(), "storage": _storage_mode()})
        except Exception as e:  # noqa: BLE001
            self._send(500, {"error": "Could not load SOPs: " + str(e)})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
            self._send(200, dispatch(body))
        except ValueError as e:
            self._send(400, {"error": str(e)})
        except Exception as e:  # noqa: BLE001
            self._send(500, {"error": "Save failed: " + str(e)})
