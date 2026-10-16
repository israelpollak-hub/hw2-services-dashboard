# 3rd Party Services Dashboard (HW2)

**Course:** AI Assisted Development of Products and Services – Prof. Rosenthal, Fall 2026
**Author:** Sruly (Israel Pollak)

## What is this?
This project connects **Claude Code** to four online services through **MCP servers** (Model Context Protocol – a standard "plug" that lets an AI use a service's tools), downloads data from each service into local files with a documented format, and shows all of it in a **local dashboard website** where you can search across every service at once.

```
 Gmail ─┐                                      ┌──────────────────────┐
Calendar┤  Claude Code + MCP   ┌────────────┐   │  Dashboard website   │
 GitHub ┼────────────────────► │ dataExports│ ─►│  (localhost:8000)    │
 Notion ┘  (download skill)    └────────────┘   │  search all services │
                                local files     └──────────────────────┘
```

All data is **fictional test data** about an imaginary fixed-income firm, *Quillfeather Capital*, building a bond-analytics tool called *DuraLens* for its client, the *Bayview Teachers Pension Fund*. The same characters (Joe Smith, Maria Delgado, Priya Natarajan, Daniel Okafor, Rachel Stein) appear in every service, so a search like "Rachel Stein" or "convexity" returns results from all four.

## Services and how they are connected
| Service | MCP server | Account used | Configured in |
|---|---|---|---|
| Notion | Official Notion MCP (`https://mcp.notion.com/mcp`) | Notion workspace created for this project | `.mcp.json` |
| GitHub | Official GitHub MCP (`https://api.githubcopilot.com/mcp/`) | Test organization `sruly-hw2-test` (fine-grained token limited to that org) | `.mcp.json` |
| Gmail | Claude.ai Gmail connector | Dedicated test account `israelpollak41@gmail.com` | Claude.ai account (not in `.mcp.json`) |
| Google Calendar (extra service) | Claude.ai Google Calendar connector | Same test account | Claude.ai account (not in `.mcp.json`) |

**Why Gmail and Calendar are not in `.mcp.json`:** Google's official Gmail and Calendar MCP servers (`gmailmcp.googleapis.com`, `calendarmcp.googleapis.com`) were configured first, but every tool call failed because they require the Google Cloud project to be enrolled in the *Google Workspace Developer Preview Program* (Workspace accounts only). With the professor's approval, Gmail and Calendar use the Claude.ai connectors instead. Those live in the Claude.ai account and are loaded by Claude Code automatically, so they don't appear in the project's `.mcp.json`.

**No secrets in this repo:** `.mcp.json` only contains server addresses. The GitHub token is referenced as `${GITHUB_PAT}` (an environment variable on the local computer). Logins for Notion, Gmail and Calendar are stored by Claude Code / Claude.ai, not in the project.

## Repository structure
```
.
├── README.md                    ← this file
├── localStorageFormats.md       ← specification of the local data format
├── .mcp.json                    ← MCP servers used by the project (Notion, GitHub)
├── .claude/
│   └── skills/
│       └── download-service-data/
│           └── SKILL.md         ← skill: repeatable downloads in the documented format
├── dataExports/                 ← downloaded data (one folder per service)
│   ├── gmail/
│   ├── calendar/
│   ├── github/
│   └── notion/
├── dashboard/                   ← local website (HTML/CSS/JS) + its README
└── presentation/                ← PowerPoint and demo video
```

## How the data is stored
Every service follows the same pattern (full details in [`localStorageFormats.md`](localStorageFormats.md)):
- `dataExports/<service>/index.json` – list of all downloaded items (the dashboard reads this first).
- One folder per item with `metadata.json` (who, when, where, IDs, links) and one human-readable content file (`body.txt`, `description.txt`, `README.md` + `issues/`, `content.md`).
- All timestamps in UTC (ISO 8601). Repeated downloads update existing items instead of duplicating them.

## How to download (or refresh) the data
Open Claude Code in this folder and ask in plain language, for example:
> Download any new emails, calendar events, GitHub issues and Notion pages into the project.

Claude Code automatically uses the project skill `.claude/skills/download-service-data/SKILL.md`, which tells it which connector to use for each service, that downloads are read-only, and how to store everything exactly as `localStorageFormats.md` specifies.

## How to run the dashboard
```bash
cd services-dashboard            # the project root (this folder)
python3 -m http.server 8000
```
Open **http://localhost:8000/dashboard/** in a browser. Stop the server with `Ctrl+C`.
More details in [`dashboard/README.md`](dashboard/README.md).

## Project steps
1. Created test accounts/data containers and connected the four MCP servers.
2. Populated each service with 10+ realistic test items (separate Claude Code conversation, then `/clear`).
3. Designed the storage format first (`localStorageFormats.md`), then downloaded the data following it and created the download skill.
4. `/clear`, created a few new items, and asked for "any new" data without mentioning the skill: Claude used the skill on its own and stored the new items in the same format without duplicates.
5. `/clear`, built the dashboard from the local files only.
