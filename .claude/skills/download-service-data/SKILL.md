---
name: download-service-data
description: Download, export or save data from Gmail, Google Calendar, GitHub or Notion into this project's local `dataExports/` folder, in the exact format defined by `localStorageFormats.md`. Use when the user asks to download / export / sync / refresh / back up / save emails, calendar events, GitHub repos and issues, or Notion pages locally, or to update the dashboard's data.
---

# Download service data to `dataExports/`

## Rules
1. **Read `localStorageFormats.md` (project root) completely before writing anything.** It is the specification (folders, file names, JSON fields, UTC dates, `index.json`, upsert). Follow it exactly. If a field cannot be obtained, use `null` and tell the user at the end; never invent another format.
2. **Downloads are READ-ONLY.** Never create, modify, send, label, trash or delete anything in Gmail, Calendar, GitHub or Notion. Use only read/search/get/list tools. Do not use e.g. `send_message`, `create_event`, `issue_write`, `notion-update-page`.
3. Write only inside `dataExports/`. Never write tokens, passwords or OAuth data there. Attachments are not downloaded, only their names.
4. Save to the project root's `dataExports/` regardless of the current working directory.

## Sources
| Service | Connector / tools | Scope (defaults, unless the user says otherwise) |
|---|---|---|
| Gmail | claude.ai Gmail: `search_threads`, `get_message` (use `messageFormat: PLAIN_TEXT`) | Account `israelpollak41@gmail.com`. Messages received in the last 3 days, excluding automated senders ending in `google.com` (query: `newer_than:3d -from:google.com`). |
| Google Calendar | claude.ai Google Calendar: `list_calendars`, `list_events`, `get_event` | Account `israelpollak41@gmail.com`, primary calendar, from today through the next 14 days. |
| GitHub | `github` project MCP (`.mcp.json`): `search_repositories`, `list_issues`, `get_file_contents` | Organization `sruly-hw2-test`: all repos, each with README and all issues (open and closed). |
| Notion | `notion` project MCP: `notion-search`, `notion-fetch` | Parent page "Quillfeather Capital — HW2" and all its child pages. |

If these tools are not loaded, load them with ToolSearch first. If a call is denied by permissions, stop and tell the user which permission rule is needed. Do not work around it.

## Procedure (for each requested service)
1. **Account check (Gmail/Calendar):** confirm the account is `israelpollak41@gmail.com` (e.g. `list_calendars` returns it as the primary calendar id; Gmail `to`/`viewUrl` show it). If not, STOP and tell the user.
2. **List** the items in scope (paginate until done; check page tokens / `nextPageToken`).
3. **Fetch full content** of each item:
   - Gmail: one item per *message* (not thread); body = `plaintextBody` exactly as received.
   - Calendar: one item per event; for a recurring series fetch the master event (`recurringEventId`, via `get_event`) to get `recurrence`, store the series **once** with the first occurrence's start/end.
   - GitHub: repo metadata (`search_repositories` with `org:sruly-hw2-test`, `minimal_output: false`), README via `get_file_contents path=README.md` (empty file if none), all issues via `list_issues` (state not filtered).
   - Notion: fetch the parent page, then every child page listed in its content (follow nested children too). Content = the page Markdown.
4. **Convert** to the spec: all timestamps in UTC `YYYY-MM-DDTHH:MM:SSZ`; keep the original zone in `time_zone`; missing values `null`, empty lists `[]`; snake_case keys; 2-space indent UTF-8. Build folder names from the slug rules (Gmail/Calendar: `YYYY-MM-DDTHHMMZ_<slug>`; GitHub: repo name; Notion: slug of title; collisions get `-2`, `-3`).
5. **Upsert** (spec 1.6): read the existing `dataExports/<service>/index.json` if present. If an item with the same `id` exists, overwrite its files in its existing folder (keep the folder name) and refresh `downloaded_at`; otherwise create a new folder. Never delete items that are not part of this download.
6. **Write** per item: `metadata.json` + the content file (`body.txt`, `description.txt`, `README.md` + `issues/<number>.json`, or `content.md`).
7. **Update `index.json`**: `service`, `updated_at` (now, UTC), `item_count`, and `items` (`id`, `title`, `folder`, `created_at`) sorted by `created_at`, newest first (if `created_at` is `null`, as in Notion, sort by the item's `updated_at`). The index must include previously stored items too.
8. For many items, write a throwaway script in the scratchpad (not in the project) that generates the files from the fetched data; run Python with `-I`.
9. Run the checklist below, then report to the user: a table `service | items downloaded | example folder | problems`, plus anything that did not fit the spec.

## Known limitations (use `null`/defaults and report them)
- Notion's API returns only the last-edited time, so `created_at` is `null` and `last_edited_by` is `null`. Index entries then have `created_at: null`.
- GitHub: the connector returns numeric repo IDs (not `R_kgDO…` node IDs); issue labels were not returned, so `labels` is `[]`.
- Gmail `cc`/`attachments` are `[]` when the connector returns none.
- Calendar events may carry a `timeZone` while `dateTime` already ends in `Z`; store the `dateTime` value as UTC and the zone in `time_zone`.

## Verification checklist
- [ ] Account confirmed as `israelpollak41@gmail.com` (Gmail/Calendar).
- [ ] Nothing was created, changed or deleted in any service.
- [ ] Every item folder has `metadata.json` and the content file named in its `content_file`.
- [ ] Every service folder has a valid `index.json`; `item_count` equals `len(items)`; each `folder` exists; ids match `metadata.json`; sorted newest first (Notion: by `updated_at`).
- [ ] All JSON files parse; all dates are UTC ending in `Z` (or `null`).
- [ ] No duplicate ids; re-running did not create new folders for existing ids.
- [ ] GitHub: every number in `metadata.json` `issues` has a file in `issues/`; `open_issues_count` is consistent.
- [ ] Recurring calendar events are stored once, with `recurrence` set.
- [ ] No secrets or tokens in `dataExports/`; nothing written outside `dataExports/` (except this skill).
- [ ] Final report lists item counts, example folders, and every field set to `null` or deviating from the spec.
