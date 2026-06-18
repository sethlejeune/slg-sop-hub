"""
Local preview server for The SLG Team SOP Library.

Serves the static site AND runs the SOP generator at /api/generate-sop, using
the exact same logic as the Vercel function (api/generate-sop.py) — one source
of truth. This file is for local preview only; it is not deployed.

Run:  python3 dev_server.py        (defaults to port 5050)
"""
import importlib.util
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "5050"))

def _load(name, filename):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, "api", filename))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# Load the two API modules (hyphenated / plain filenames) for local serving.
_gen = _load("sop_generator", "generate-sop.py")
_store = _load("sop_store", "sops.py")
generate_sop = _gen.generate_sop


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, fmt, *args):
        sys.stderr.write("[dev] " + (fmt % args) + "\n")

    def _json(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/sops":
            try:
                self._json(200, {"sops": _store.list_sops(), "storage": "local"})
            except Exception as e:  # noqa: BLE001
                self._json(500, {"error": "Could not load SOPs: " + str(e)})
            return
        super().do_GET()

    def do_POST(self):
        path = self.path.split("?")[0]
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) or b"{}"
        if path == "/api/generate-sop":
            try:
                sop, demo = generate_sop(json.loads(raw))
                self._json(200, {"sop": sop, "demo": demo})
            except ValueError as e:
                self._json(400, {"error": str(e)})
            except Exception as e:  # noqa: BLE001
                self._json(500, {"error": "Generation failed: " + str(e)})
        elif path == "/api/sops":
            try:
                self._json(200, _store.dispatch(json.loads(raw)))
            except ValueError as e:
                self._json(400, {"error": str(e)})
            except Exception as e:  # noqa: BLE001
                self._json(500, {"error": "Save failed: " + str(e)})
        else:
            self._json(404, {"error": "Not found"})


if __name__ == "__main__":
    has_key = bool(os.environ.get("ANTHROPIC_API_KEY"))
    print("\n  The SLG Team — SOP Library (local preview)")
    print("  → http://localhost:%d" % PORT)
    print("  SOP generator: %s\n" % (
        "LIVE (Claude)" if has_key else "DEMO mode — set ANTHROPIC_API_KEY for live generation"))
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
