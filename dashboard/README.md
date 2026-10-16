# Quillfeather Capital – Data Dashboard

A local, offline website that searches the data downloaded into `dataExports/` (Gmail emails, Calendar events, GitHub repos + issues, Notion pages). It never contacts Gmail, Calendar, GitHub or Notion – it only reads local files.

## Features
- One case-insensitive search box (title, content file, and metadata such as email from/to/subject, GitHub issue titles/bodies).
- Service checkboxes (Gmail, Calendar, GitHub, Notion) – search one or several.
- Colored service badge, local-time date, highlighted snippet and an "Open in <service>" link on every result.
- Click a result to expand the full content.
- Header with item counts per service; result count for the current search. Empty search shows everything, newest first.

## How to run
```
cd "/Users/sruly/Desktop/AI assisted Developement/HW2/services-dashboard"
python3 -m http.server 8000
```
Then open <http://localhost:8000/dashboard/> in your browser. Stop the server with `Ctrl+C` in the Terminal.

## Why a local server?
Browsers block `fetch()` of local files when a page is opened directly (`file://`). Serving the project root over `http://localhost` lets the page load the JSON/text files. The server must be started from the **project root** so both `dashboard/` and `dataExports/` are reachable.

## How it reads `dataExports/`
A web page cannot list folders, so it starts from each `dataExports/<service>/index.json`. For every item listed it loads `metadata.json` and the content file named in `content_file`; for GitHub it also loads each `issues/<n>.json` listed in the repo's metadata. If one service fails to load, a warning is shown and the others keep working. Format details: `localStorageFormats.md`. To refresh data, re-download it and reload the page.
