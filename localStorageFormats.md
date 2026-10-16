# Local Storage Formats

This document is the **specification** for how data downloaded from each connected service is stored on disk in this project. Every download (manual or via the `download-service-data` skill) MUST follow it exactly, so that:

1. a person can browse the files and understand them,
2. the dashboard can read every service the same way, and
3. repeated downloads never create duplicates.

---

## 1. General rules (apply to every service)

### 1.1 Folder layout
```
dataExports/
├── gmail/
│   ├── index.json
│   └── <item-folder>/
│       ├── metadata.json
│       └── body.txt
├── calendar/
│   ├── index.json
│   └── <item-folder>/
│       ├── metadata.json
│       └── description.txt
├── github/
│   ├── index.json
│   └── <repo-folder>/
│       ├── metadata.json
│       ├── README.md
│       └── issues/
│           └── <issue-number>.json
└── notion/
    ├── index.json
    └── <page-folder>/
        ├── metadata.json
        └── content.md
```
- One sub-folder of `dataExports/` per service. Folder names are fixed: `gmail`, `calendar`, `github`, `notion`.
- **One folder per item** (one email, one event, one repo, one page).
- Each item folder has exactly one `metadata.json` (data *about* the item) and one main **content file** (the item's text, readable by a human).
- Each service folder has one `index.json` listing all its items (the dashboard reads this; a web page cannot list folders by itself).

### 1.2 Item folder names
- Built from a **slug**: lowercase ASCII, every run of characters other than `a-z` and `0-9` becomes a single `-`, no leading/trailing `-`, max 60 characters.
  Example: `"Kickoff: Bayview Q4 rebalance"` → `kickoff-bayview-q4-rebalance`
- **Gmail and Calendar** folders start with a UTC timestamp so they sort chronologically:
  `YYYY-MM-DDTHHMMZ_<slug>` (no colons — colons are not allowed in macOS file names).
  Example: `2026-10-16T0315Z_kickoff-bayview-q4-rebalance`
- **GitHub** folders use the repo name: `stress-test-engine`.
- **Notion** folders use the slug of the page title: `convexity-methodology`.
- If a folder name is already used by a *different* item, append `-2`, `-3`, …

### 1.3 JSON conventions
- UTF-8, 2-space indentation, keys in `snake_case`.
- All dates/times are **ISO 8601 in UTC** with a trailing `Z`: `2026-10-16T03:15:00Z`. The original time zone, if relevant, is kept in a separate field (e.g., `time_zone`).
- Missing values are `null` (never omitted); empty lists are `[]`.

### 1.4 Common fields in every `metadata.json`
| Field | Type | Description |
|---|---|---|
| `service` | string | `"gmail"`, `"calendar"`, `"github"` or `"notion"` |
| `id` | string | The item's original ID in the service (used to detect duplicates) |
| `title` | string | Human-readable title shown in the dashboard |
| `url` | string \| null | Link to the item in the original service |
| `created_at` | string \| null | When the item was created/sent in the service (UTC); `null` if the service does not provide it (Notion) |
| `updated_at` | string \| null | Last modification in the service (UTC), if available |
| `downloaded_at` | string | When this copy was saved (UTC) |
| `content_file` | string | Name of the content file in the same folder |

### 1.5 `index.json` (one per service)
```json
{
  "service": "gmail",
  "updated_at": "2026-10-16T14:00:00Z",
  "item_count": 2,
  "items": [
    {
      "id": "1a142b7f92b9f9c2",
      "title": "Reminder: Bayview client call on Oct 20",
      "folder": "2026-10-16T0318Z_reminder-bayview-client-call-on-oct-20",
      "created_at": "2026-10-16T03:18:00Z"
    }
  ]
}
```
`items` is sorted by `created_at`, newest first. If a service does not provide `created_at` (Notion), sort by the item's `updated_at` instead.

### 1.6 Repeated downloads (upsert rule)
- If an item with the same `id` already exists in `index.json`, **overwrite** its files in its **existing folder** (keep the folder name) and update `downloaded_at`.
- If it does not exist, create a new folder and add it to `index.json`.
- **Never delete** items that are not part of the current download.

### 1.7 Security
- Never write passwords, tokens, API keys or OAuth data into `dataExports/`.
- Attachments are not downloaded; only their file names are recorded (Gmail `attachments` field).

---

## 2. Gmail
- **Item:** one email message (not one thread).
- **Folder:** `YYYY-MM-DDTHHMMZ_<slug-of-subject>`
- **Content file:** `body.txt` — the plain-text body of the email, exactly as received.

`metadata.json` example:
```json
{
  "service": "gmail",
  "id": "1a142b7f92b9f9c2",
  "title": "Reminder: Bayview client call on Oct 20",
  "url": "https://mail.google.com/mail/?authuser=israelpollak41@gmail.com#all/1a142b7f92b9f9c2",
  "created_at": "2026-10-16T03:18:00Z",
  "updated_at": null,
  "downloaded_at": "2026-10-16T14:00:00Z",
  "content_file": "body.txt",
  "thread_id": "1a142b7f92b9f9c2",
  "subject": "Reminder: Bayview client call on Oct 20",
  "from": "israelpollak41@gmail.com",
  "to": ["israelpollak41@gmail.com"],
  "cc": [],
  "date": "2026-10-16T03:18:00Z",
  "labels": ["INBOX", "UNREAD"],
  "snippet": "Hi Sruly, Quick reminder that we have the Bayview Q4 rebalance call...",
  "attachments": []
}
```

## 3. Google Calendar
- **Item:** one event. A **recurring event is stored once** (the series), with its rule in `recurrence`.
- **Folder:** `YYYY-MM-DDTHHMMZ_<slug-of-title>` (timestamp = start of the event, or of the first occurrence).
- **Content file:** `description.txt` — the event description as plain text (empty file if none).

`metadata.json` example:
```json
{
  "service": "calendar",
  "id": "jb2fhmb506plviiu63t25csjf4",
  "title": "Bayview Q4 rebalance – client call with Rachel Stein",
  "url": "https://www.google.com/calendar/event?eid=...",
  "created_at": "2026-10-16T03:15:00Z",
  "updated_at": "2026-10-16T03:15:00Z",
  "downloaded_at": "2026-10-16T14:00:00Z",
  "content_file": "description.txt",
  "calendar_id": "israelpollak41@gmail.com",
  "start": "2026-10-20T18:00:00Z",
  "end": "2026-10-20T19:00:00Z",
  "time_zone": "America/New_York",
  "all_day": false,
  "location": null,
  "organizer": "israelpollak41@gmail.com",
  "attendees": [],
  "recurrence": null,
  "status": "confirmed"
}
```
For a recurring series, `recurrence` holds the rule, e.g. `["RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT=10"]`.

## 4. GitHub
- **Item:** one repository (in organization `sruly-hw2-test`). Its issues are stored inside the repo folder.
- **Folder:** `<repo-name>`
- **Content file:** `README.md` — the repository README exactly as in GitHub (empty file if none).
- **Issues:** `issues/<number>.json`, one file per issue.

`metadata.json` example:
```json
{
  "service": "github",
  "id": "R_kgDOxxxxxx",
  "title": "stress-test-engine",
  "url": "https://github.com/sruly-hw2-test/stress-test-engine",
  "created_at": "2026-10-15T18:30:00Z",
  "updated_at": "2026-10-15T18:35:00Z",
  "downloaded_at": "2026-10-16T14:00:00Z",
  "content_file": "README.md",
  "full_name": "sruly-hw2-test/stress-test-engine",
  "description": "Parallel-shift and curve-twist stress tests for DuraLens",
  "visibility": "private",
  "default_branch": "main",
  "open_issues_count": 2,
  "issues": [1, 2]
}
```
`issues/1.json` example:
```json
{
  "number": 1,
  "title": "Stress test fails for callable bonds",
  "state": "open",
  "author": "israelpollak-hub",
  "labels": [],
  "created_at": "2026-10-15T18:40:00Z",
  "updated_at": "2026-10-15T18:40:00Z",
  "url": "https://github.com/sruly-hw2-test/stress-test-engine/issues/1",
  "body": "Reported by Daniel Okafor: ..."
}
```

## 5. Notion
- **Item:** one page under "Quillfeather Capital — HW2" (the parent page itself is also stored).
- **Folder:** `<slug-of-page-title>`
- **Content file:** `content.md` — the page content converted to Markdown (headings, lists, paragraphs).

`metadata.json` example:
```json
{
  "service": "notion",
  "id": "3fadfd80-ac03-80xx-xxxx-xxxxxxxxxxxx",
  "title": "Convexity methodology",
  "url": "https://www.notion.so/...",
  "created_at": "2026-10-15T17:20:00Z",
  "updated_at": "2026-10-15T17:21:00Z",
  "downloaded_at": "2026-10-16T14:00:00Z",
  "content_file": "content.md",
  "parent_id": "3fadfd80-ac03-80yy-yyyy-yyyyyyyyyyyy",
  "parent_title": "Quillfeather Capital — HW2",
  "last_edited_by": null
}
```
