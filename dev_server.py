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

# Load generate_sop() from api/generate-sop.py (hyphenated filename).
_spec = importlib.util.spec_from_file_location(
    "sop_generator", os.path.join(ROOT, "api", "generate-sop.py")
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
generate_sop = _mod.generate_sop


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

    def do_POST(self):
        if self.path.split("?")[0] != "/api/generate-sop":
            self._json(404, {"error": "Not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(length) or b"{}")
            sop, demo = generate_sop(payload)
            self._json(200, {"sop": sop, "demo": demo})
        except ValueError as e:
            self._json(400, {"error": str(e)})
        except Exception as e:  # noqa: BLE001
            self._json(500, {"error": "Generation failed: " + str(e)})


if __name__ == "__main__":
    has_key = bool(os.environ.get("ANTHROPIC_API_KEY"))
    print("\n  The SLG Team — SOP Library (local preview)")
    print("  → http://localhost:%d" % PORT)
    print("  SOP generator: %s\n" % (
        "LIVE (Claude)" if has_key else "DEMO mode — set ANTHROPIC_API_KEY for live generation"))
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
