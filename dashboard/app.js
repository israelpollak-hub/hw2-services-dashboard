'use strict';
const SERVICES = {
  gmail: 'Gmail', calendar: 'Calendar', github: 'GitHub', notion: 'Notion'
};
const BASE = '../dataExports/';
const state = { items: [], loaded: {}, enabled: { gmail: true, calendar: true, github: true, notion: true } };

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const enc = s => s.split('/').map(encodeURIComponent).join('/');

async function getJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(path + ' → HTTP ' + r.status);
  return r.json();
}
async function getText(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(path + ' → HTTP ' + r.status);
  return r.text();
}

async function loadItem(service, entry) {
  const dir = `${BASE}${service}/${enc(entry.folder)}/`;
  const meta = await getJSON(dir + 'metadata.json');
  let content = '';
  try { content = await getText(dir + enc(meta.content_file)); } catch (e) { console.warn(e.message); }
  const item = { service, meta, content, issues: [] };
  if (service === 'github') {
    const nums = Array.isArray(meta.issues) ? meta.issues : [];
    const res = await Promise.all(nums.map(n => getJSON(`${dir}issues/${n}.json`).catch(e => { console.warn(e.message); return null; })));
    item.issues = res.filter(Boolean);
  }
  // sortable/displayed date
  item.date = service === 'calendar' ? (meta.start || meta.created_at)
    : (meta.created_at || meta.updated_at || null);
  item.ts = item.date ? Date.parse(item.date) : 0;
  item.haystack = buildHaystack(item);
  return item;
}

function buildHaystack(it) {
  const m = it.meta;
  const parts = [m.title, it.content];
  const flat = v => Array.isArray(v) ? v.join(' ') : v;
  ['subject', 'from', 'to', 'cc', 'snippet', 'labels', 'attachments', 'location', 'organizer', 'attendees',
    'description', 'full_name', 'parent_title'].forEach(k => {
    const v = m[k];
    if (v == null) return;
    parts.push(flat(Array.isArray(v) ? v.map(x => typeof x === 'object' ? JSON.stringify(x) : x) : v));
  });
  it.issues.forEach(i => parts.push(i.title, i.body, i.author, flat(i.labels && i.labels.map(l => l.name || l))));
  return parts.filter(Boolean).join('\n');
}

async function loadService(service) {
  try {
    const idx = await getJSON(`${BASE}${service}/index.json`);
    const results = await Promise.allSettled(idx.items.map(e => loadItem(service, e)));
    const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    state.items.push(...ok);
    state.loaded[service] = ok.length;
    const failed = results.length - ok.length;
    if (failed) warn(`${SERVICES[service]}: ${failed} item(s) could not be loaded.`);
  } catch (e) {
    state.loaded[service] = 0;
    warn(`${SERVICES[service]}: could not load index (${e.message}). Other services still work.`);
  }
}

function warn(msg) {
  const d = document.createElement('div');
  d.className = 'warn'; d.textContent = '⚠ ' + msg;
  $('warnings').appendChild(d);
}

function fmtDate(iso, withTime = true) {
  if (!iso) return 'No date';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString(undefined, withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' });
}

const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function highlight(text, q) {
  if (!q) return esc(text);
  const re = new RegExp(reEsc(q), 'gi');
  let out = '', last = 0, m;
  while ((m = re.exec(text))) {
    out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
    last = m.index + m[0].length;
  }
  return out + esc(text.slice(last));
}

function snippet(it, q) {
  const clean = s => s.replace(/\s+/g, ' ').trim();
  if (!q) {
    const base = clean(it.meta.snippet || it.meta.description || it.content || '');
    return esc(base.slice(0, 160)) + (base.length > 160 ? '…' : '');
  }
  const low = q.toLowerCase();
  // try the content first, then the whole haystack
  for (const src of [it.meta.title || '', it.content, it.haystack]) {
    const text = clean(src);
    const i = text.toLowerCase().indexOf(low);
    if (i >= 0) {
      const s = Math.max(0, i - 60), e = Math.min(text.length, i + q.length + 100);
      return (s > 0 ? '…' : '') + highlight(text.slice(s, e), q) + (e < text.length ? '…' : '');
    }
  }
  return '';
}

function md(src) {
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  let html = '', inList = false;
  const close = () => { if (inList) { html += '</ul>'; inList = false; } };
  for (const line of src.split('\n')) {
    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)/))) { close(); const n = Math.min(m[1].length, 3); html += `<h${n}>${inline(m[2])}</h${n}>`; }
    else if ((m = line.match(/^\s*[-*]\s+(.*)/))) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(m[1])}</li>`; }
    else if (!line.trim()) close();
    else { close(); html += `<p>${inline(line)}</p>`; }
  }
  close();
  return `<div class="md">${html}</div>`;
}

function metaLines(it) {
  const m = it.meta, rows = [];
  const add = (k, v) => { if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) rows.push(`<div><strong>${k}:</strong> ${esc(Array.isArray(v) ? v.join(', ') : v)}</div>`); };
  if (it.service === 'gmail') {
    add('From', m.from); add('To', m.to); add('Cc', m.cc); add('Date', fmtDate(m.date || m.created_at));
    add('Attachments', m.attachments && m.attachments.map(a => a.filename || a.name || a));
  } else if (it.service === 'calendar') {
    add('Start', fmtDate(m.start, !m.all_day)); add('End', fmtDate(m.end, !m.all_day)); add('Location', m.location);
    add('Organizer', m.organizer);
    add('Attendees', (m.attendees || []).map(a => typeof a === 'string' ? a : (a.email || a.name)));
    add('Recurrence', m.recurrence);
  } else if (it.service === 'github') {
    add('Repository', m.full_name); add('Description', m.description); add('Visibility', m.visibility);
  } else {
    add('Parent', m.parent_title); add('Last updated', m.updated_at && fmtDate(m.updated_at));
  }
  return `<div class="meta">${rows.join('')}</div>`;
}

function fullContent(it) {
  let body;
  if (it.service === 'github' || it.service === 'notion') body = md(it.content || '');
  else body = `<pre>${esc(it.content || '(no content)')}</pre>`;
  if (it.service === 'github') {
    body += `<div class="issues"><h4>Issues (${it.issues.length})</h4>` + (it.issues.map(i =>
      `<div class="issue"><div class="row"><span class="state ${esc(i.state)}">${esc(i.state)}</span>
      <strong>#${i.number} ${esc(i.title)}</strong></div>
      <div class="meta">by ${esc(i.author)} · ${fmtDate(i.created_at)}${i.url ? ` · <a href="${esc(i.url)}" target="_blank" rel="noopener">open</a>` : ''}</div>
      <pre>${esc(i.body || '')}</pre></div>`).join('') || '<div class="meta">No issues.</div>') + '</div>';
  }
  return metaLines(it) + body;
}

function render() {
  const q = $('q').value.trim();
  const low = q.toLowerCase();
  const list = state.items
    .filter(it => state.enabled[it.service])
    .filter(it => !q || it.haystack.toLowerCase().includes(low))
    .sort((a, b) => b.ts - a.ts);
  $('summary').textContent = q
    ? `${list.length} result${list.length === 1 ? '' : 's'} for “${q}”`
    : `Showing all ${list.length} items, newest first`;
  if (!list.length) { $('results').innerHTML = '<div class="empty">No matching items.</div>'; return; }
  $('results').innerHTML = list.map((it, i) => {
    const m = it.meta, name = SERVICES[it.service];
    return `<article class="item s-${it.service}" data-i="${i}">
      <div class="head">
        <div class="row"><span class="badge b-${it.service}">${name}</span>
          <span class="title">${highlight(m.title || '(untitled)', q)}</span>
          <span class="date">${fmtDate(it.date)}</span></div>
        <div class="snip">${snippet(it, q)}</div>
      </div>
      <div class="foot">${m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">Open in ${name} ↗</a>` : ''}</div>
      <div class="full"></div></article>`;
  }).join('');
  $('results').onclick = e => {
    if (e.target.closest('a')) return;
    const head = e.target.closest('.head'); if (!head) return;
    const art = head.parentElement, full = art.querySelector('.full');
    if (!full.innerHTML) full.innerHTML = fullContent(list[+art.dataset.i]);
    art.classList.toggle('open');
  };
}

function renderCounts() {
  $('counts').innerHTML = Object.keys(SERVICES).map(s =>
    `<span class="c">${SERVICES[s]}: ${state.loaded[s] ?? 0}</span>`).join('') +
    `<span class="c">Total: ${state.items.length}</span>`;
}

async function init() {
  $('services').innerHTML = Object.keys(SERVICES).map(s =>
    `<label><input type="checkbox" data-s="${s}" checked><span class="badge b-${s}">${SERVICES[s]}</span></label>`).join('');
  $('services').addEventListener('change', e => { state.enabled[e.target.dataset.s] = e.target.checked; render(); });
  let t; $('q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 120); });
  await Promise.all(Object.keys(SERVICES).map(loadService));
  renderCounts();
  render();
}
init();
