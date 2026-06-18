"""
The SLG Team — SOP generator (Vercel Python serverless function).

POST /api/generate-sop
Body: { title, category, owner, frequency, details }
Returns: { sop: {...}, demo: bool } or { error: "..." }

Set the ANTHROPIC_API_KEY environment variable (locally or in Vercel) to
generate real SOPs with Claude. Without it, a clearly-labeled demo SOP is
returned so the form is always testable.
"""
import json
import os
import re

MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = """You are the SOP writer for The SLG Team, a residential real \
estate team led by Seth Lejeune. You turn a few rough notes into a clean, \
simple, professional Standard Operating Procedure that matches the team's \
existing SOP format.

Write so a brand-new assistant could follow it on day one. Rules:
- Plain, direct language. No fluff, no clichés, no corporate filler.
- Break the work into clear named steps, each with concrete, ordered actions.
- Every action is a short imperative sentence ("Log in to...", "Upload the...").
- Keep the tone warm and professional — luxury real estate, but practical.
- Only use the information given. Do not invent specific tools, names, URLs, \
prices, or numbers that were not provided. If a tool is clearly implied by the \
notes, you may name it.
- Aim for 2-6 steps. Each step has 2-6 actions.
Return ONLY the structured SOP."""

# JSON schema the model must fill (content fields only — title/category/owner/
# frequency are supplied by the user and merged back in afterward).
SOP_SCHEMA = {
    "type": "object",
    "properties": {
        "purpose": {
            "type": "string",
            "description": "1-3 sentences: why this procedure exists and what done looks like.",
        },
        "steps": {
            "type": "array",
            "description": "Ordered steps. 2-6 of them.",
            "items": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "Short step name, e.g. 'Step 1 — Pull the data'.",
                    },
                    "actions": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Concrete imperative actions for this step.",
                    },
                },
                "required": ["title", "actions"],
                "additionalProperties": False,
            },
        },
        "tools": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Tools, apps, or accounts used. Empty array if none mentioned.",
        },
        "estimatedTime": {
            "type": "string",
            "description": "Rough time to complete, e.g. '30 minutes'. Empty string if unknown.",
        },
        "definitionOfDone": {
            "type": "string",
            "description": "One sentence: how you know the task is complete.",
        },
        "qualityStandards": {
            "type": "string",
            "description": "Optional. The bar for good work. Empty string if not applicable.",
        },
    },
    "required": ["purpose", "steps", "tools", "estimatedTime", "definitionOfDone"],
    "additionalProperties": False,
}


def _clean(s):
    return (s or "").strip()


def _extract_json(text):
    """Return the JSON object from the model output, tolerating code fences."""
    t = (text or "").strip()
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z]*\n?", "", t)
        t = re.sub(r"\n?```$", "", t).strip()
    start, end = t.find("{"), t.rfind("}")
    if start != -1 and end != -1 and end > start:
        return t[start:end + 1]
    return t


def generate_sop(answers):
    """Returns (sop_dict, is_demo). Never raises for normal flow."""
    title = _clean(answers.get("title"))
    category = _clean(answers.get("category")) or "Other"
    owner = _clean(answers.get("owner"))
    frequency = _clean(answers.get("frequency"))
    details = _clean(answers.get("details"))

    if not title or not details:
        raise ValueError("Please provide a task title and some details.")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return _demo_sop(title, category, owner, frequency, details), True

    try:
        import anthropic
    except ImportError:
        return _demo_sop(title, category, owner, frequency, details), True

    user_msg = (
        "Write a Standard Operating Procedure from these notes.\n\n"
        "TASK / PROCESS: " + title + "\n"
        "CATEGORY: " + category + "\n"
        + ("WHO DOES IT: " + owner + "\n" if owner else "")
        + ("HOW OFTEN: " + frequency + "\n" if frequency else "")
        + "\nNOTES / ROUGH STEPS:\n" + details
    )

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=MODEL,
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
        output_config={
            "format": {"type": "json_schema", "schema": SOP_SCHEMA},
            "effort": "low",
        },
    )

    if getattr(response, "stop_reason", None) == "refusal":
        raise RuntimeError(
            "Claude declined to generate this SOP. Try rephrasing the task or details."
        )

    text = ""
    for block in response.content:
        if getattr(block, "type", None) == "text":
            text = block.text
            break
    data = json.loads(_extract_json(text))

    sop = {
        "title": title,
        "category": category,
        "owner": owner,
        "frequency": frequency,
        "code": "DRAFT",
        "purpose": data.get("purpose", ""),
        "steps": data.get("steps", []),
        "tools": [{"label": t} for t in (data.get("tools") or []) if t],
        "estimatedTime": data.get("estimatedTime", ""),
        "definitionOfDone": data.get("definitionOfDone", ""),
        "qualityStandards": data.get("qualityStandards", ""),
    }
    return sop, False


def _demo_sop(title, category, owner, frequency, details):
    """A plausible, clearly-labeled SOP built from the notes — no API needed."""
    # Split the notes into action-sized pieces.
    raw = re.split(r"[\n;]+|(?<=[.!?])\s+(?=[A-Z])", details)
    pieces = [p.strip().rstrip(".") for p in raw if p.strip()]
    if not pieces:
        pieces = [details.strip().rstrip(".")]
    actions = [p[0].upper() + p[1:] + "." for p in pieces][:8]

    # Group into up to 3 steps for a more SOP-like shape.
    steps = []
    if len(actions) <= 3:
        steps = [{"title": "Step 1 — Complete the task", "actions": actions}]
    else:
        n = (len(actions) + 2) // 3
        labels = ["Step 1 — Prepare", "Step 2 — Do the work", "Step 3 — Finish & verify"]
        for i in range(0, len(actions), n):
            steps.append({
                "title": labels[min(len(steps), 2)],
                "actions": actions[i:i + n],
            })

    # Guess a few tools mentioned in the notes.
    known = ["Canva", "Bright MLS", "Wise Pelican", "Follow Up Boss", "CapCut",
             "HeyGen", "ElevenLabs", "Descript", "Premiere Pro", "YouTube",
             "Captivate", "OPUS Clips", "Meta Business Suite", "Vistaprint",
             "Trello", "Instagram", "Facebook", "Excel", "Google Sheets"]
    low = details.lower()
    tools = [{"label": k} for k in known if k.lower() in low]

    return {
        "title": title,
        "category": category,
        "owner": owner,
        "frequency": frequency,
        "code": "DRAFT",
        "purpose": (
            "This SOP outlines the process for " + title
            + ", so the work stays consistent, efficient, and on-brand for The SLG Team."
        ),
        "steps": steps,
        "tools": tools,
        "estimatedTime": "",
        "definitionOfDone": (
            "The task is complete when every step above has been finished and the "
            "result has been reviewed for quality and accuracy."
        ),
        "qualityStandards": "",
    }


# ── Vercel serverless entrypoint ─────────────────────────────────────────────
try:
    from http.server import BaseHTTPRequestHandler

    class handler(BaseHTTPRequestHandler):
        def _send(self, code, obj):
            body = json.dumps(obj).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_POST(self):
            try:
                length = int(self.headers.get("Content-Length", 0))
                payload = json.loads(self.rfile.read(length) or b"{}")
                sop, demo = generate_sop(payload)
                self._send(200, {"sop": sop, "demo": demo})
            except ValueError as e:
                self._send(400, {"error": str(e)})
            except Exception as e:  # noqa: BLE001
                self._send(500, {"error": "Generation failed: " + str(e)})

        def do_GET(self):
            self._send(200, {"ok": True, "service": "slg-sop-generator"})

except ImportError:
    pass
