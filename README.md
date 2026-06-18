# The SLG Team — SOP Library

A clean, searchable home for every Standard Operating Procedure the team runs,
plus an **AI SOP Builder** that writes a brand-new SOP from a few quick notes
using the Claude API.

Built as a zero-build static site + one Python serverless function, so it
deploys to **Vercel** in one click and connects to **theslgteam.com**.

## What's inside

| Path | What it is |
| --- | --- |
| `index.html` | The app shell (header, footer) |
| `assets/sops.js` | All SOP content — the single source of truth |
| `assets/app.js` | Library, search/filter, detail pages, and the generator UI |
| `assets/styles.css` | Branding and layout |
| `api/generate-sop.py` | Serverless function that calls Claude to write a new SOP |
| `dev_server.py` | Local preview server (not deployed) |
| `requirements.txt` | Python dependency for the function (`anthropic`) |
| `vercel.json` | Vercel config |

## Run it locally

```bash
python3 dev_server.py
# → http://localhost:5050
```

The SOP generator runs in **demo mode** until you add an API key. To generate
real SOPs with Claude locally:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
python3 dev_server.py
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → import the repo**. No build settings needed —
   it's a static site with a Python function.
3. **Project → Settings → Environment Variables**: add
   `ANTHROPIC_API_KEY` with your Anthropic key.
4. **Project → Settings → Domains**: add `theslgteam.com` and follow the DNS steps.

The AI SOP Builder goes live the moment the API key is set.

## Add or edit SOPs

Edit `assets/sops.js` — each SOP is one object. New entries appear in the
library automatically, grouped by `category`. You can also generate one in the
app, download the `.md`, and convert it into an entry.

## Model

The generator uses Claude **`claude-opus-4-8`** with structured JSON output, so
every generated SOP matches the library's format exactly.
