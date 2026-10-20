// Community Daily — 2a renderer. JSON report data -> inline-styled HTML (web + email-friendly).
// Usage: import { renderReport, planFor, validate } from './render-2a.js';
//        const html = renderReport(data, { mode: 'full', assetBase: 'https://cdn.example.com/daily/' });

import * as V3 from './v3.js';
const V = '#3617CE', INK = '#111111', TXT = '#2A2A2A', SUB = '#555555', MUTED = '#666666';
const TINT = '#F1EFFC', PANEL = '#F7F6FB', RULE = '#DCDAD3', HAIR = '#E3E0EE';
const MONO = "font-family:'IBM Plex Mono',monospace;";
const DISP = "font-family:'SKT Sans Display','SKT Sans Text','Pretendard Variable',Pretendard,sans-serif;";
const BODY = "font-family:'SKT Sans Text','Pretendard Variable',Pretendard,sans-serif;";
const LC = { 조짐: '#E0A030', 포착: '#E0A030', 확산: V, 정착: '#3E9B6A', 소멸: '#8A8F98' };

export const SECTIONS = {
  hot: { title: '오늘의 화제 TOP 6' },
  signal: { title: '리틀 시그널 워치', sub: '내일의 이슈 후보 — 아직 작지만 커질 수 있는 신호' },
  trend: { title: 'TREND', sub: '화력 · 라이프사이클' },
  sns: { title: 'SNS 크로스플랫폼 교차검증' },
  special: { title: '요일 특집' },
  news: { title: '비즈니스 & 미디어 뉴스' },
  desk: { title: '데스크 시사점' },
  search: { title: '네이버 검색어 Top 20' },
  voc: { title: 'SKB VoC', pilot: true },
  sources: { title: '출처' },
  board: { title: '익명 게시판', sub: 'ANONYMOUS' }
};
export const ORDER = ['signal', 'hot', 'trend', 'sns', 'special', 'news', 'desk', 'search', 'voc', 'sources', 'board'];
export const REQUIRED = ['hot', 'signal', 'trend', 'news', 'desk', 'search', 'sources'];
export const WEEKDAY_PLAN = {
  1: { label: '월', special: { name: '월요일 미디어산업 위클리', subs: ['플랫폼별 시청률·순위', '금주의 신작', '다음 주 예정작', '6개월 이슈 캘린더', '사업자 동향', '신규·부가서비스'] } },
  2: { label: '화', special: { name: '화요일 SNS TRENDS' } },
  3: { label: '수', special: { name: '수요일 맛집·음식 급상승' } },
  4: { label: '목', special: { name: '목요일 팝업스토어·핫플레이스' } },
  5: { label: '금', special: { name: '금요일 쇼핑·커머스 급상승' } },
  6: { label: '토', special: null },
  0: { label: '일', special: null }
};

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function planFor(date) {
  const d = new Date(date + 'T00:00:00Z'), wd = d.getUTCDay(), p = WEEKDAY_PLAN[wd];
  const sections = ORDER.filter(id => id !== 'special' || p.special);
  return { weekday: wd, label: p.label, special: p.special, sections, required: REQUIRED.concat(p.special ? ['special'] : []) };
}

export function validate(data) {
  const plan = planFor(data.meta.date), have = new Set((data.sections || []).map(s => s.id));
  const issues = [];
  if (!data.top || !data.top.title) issues.push('top: TOP STORY 없음');
  if (!data.brief || !data.brief.length) issues.push('brief: 오늘의 핵심 3줄 없음');
  plan.required.forEach(id => { if (!have.has(id)) issues.push(id + ': 필수 섹션 없음'); });
  if (plan.special && plan.special.subs) {
    const sp = (data.sections || []).find(s => s.id === 'special');
    const subs = sp ? (sp.subsections || []).map(x => x.title) : [];
    plan.special.subs.forEach(n => { if (!subs.some(t => t.indexOf(n.slice(0, 4)) >= 0)) issues.push('special: 하위 항목 "' + n + '" 없음'); });
  }
  return { plan, issues };
}

const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = h => String(h == null ? '' : h)
  .replace(/<a\s+href=/g, `<a target="_blank" rel="noopener noreferrer" style="color:${V};text-decoration:underline;" href=`)
  .replace(/<b>/g, `<b style="color:${INK};font-weight:700;">`);
const P = (h, sz = 14) => `<p style="margin:6px 0 10px;font-size:${sz}px;line-height:1.75;color:${TXT};">${rich(h)}</p>`;
const mono = (t, extra = '') => `<span style="${MONO}font-size:11px;color:${V};letter-spacing:.04em;${extra}">${esc(t)}</span>`;

function head(num, title, sub, pilot) {
  return `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding-top:26px;margin-top:30px;border-top:1px solid ${INK};margin-bottom:14px;">`
    + `<div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;"><span style="font-size:21px;font-weight:700;letter-spacing:-.02em;">${esc(title)}</span>`
    + (sub ? `<span style="font-size:13px;color:${SUB};">${esc(sub)}</span>` : '')
    + (pilot ? `<span style="${MONO}font-size:10.5px;color:#FFFFFF;background:${V};padding:2px 6px;">PILOT</span>` : '')
    + `</div><div style="${MONO}font-size:11px;color:${V};">${String(num).padStart(2, '0')}</div></div>`;
}

const B = {
  text: b => P(b.html, b.size || 14),
  caption: b => `<div style="font-size:11.5px;color:${MUTED};line-height:1.6;margin:6px 0 16px;">${rich(b.html)}</div>`,
  subhead: b => `<div style="${MONO}font-size:11px;letter-spacing:.06em;font-weight:600;color:${INK};border-bottom:1px solid ${INK};padding-bottom:6px;margin:22px 0 10px;">${esc(b.text)}</div>`,
  note: b => `<div style="background:${TINT};padding:12px 14px;font-size:13px;line-height:1.7;color:#333333;margin:8px 0 12px;">${rich(b.html)}</div>`,
  articles: b => b.items.map((a, i) => `<div style="display:flex;flex-direction:column;gap:4px;margin-top:${i ? 22 : 0}px;padding-top:14px;border-top:1px solid ${INK};">`
    + (a.src ? mono(a.src, 'font-size:10.5px;') : '')
    + `<div style="font-size:16px;font-weight:700;line-height:1.45;">${rich(a.title)}</div></div>`
    + (a.paras || []).map(p => P(p)).join('')).join(''),
  watch: b => `<div style="display:flex;flex-direction:column;margin:4px 0 10px;">` + b.items.map(w => {
    const c = Object.keys(LC).find(k => (w.tag || '').indexOf(k) >= 0) || '조짐';
    return `<div style="display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;font-size:13px;line-height:1.65;padding:9px 0;border-top:1px solid ${RULE};">`
      + `<span style="${MONO}font-size:11px;display:flex;align-items:flex-start;gap:6px;padding-top:2px;"><span style="width:7px;height:7px;margin-top:4px;flex:none;background:${LC[c]};"></span>${esc(w.tag)}</span>`
      + `<span>${rich(w.html)}</span></div>`;
  }).join('') + `</div>`,
  bars: b => `<div style="background:${PANEL};padding:16px 16px 6px;margin:0 0 14px;">`
    + (b.title ? `<div style="font-size:14px;font-weight:700;margin-bottom:8px;line-height:1.4;">${esc(b.title)}</div>` : '')
    + b.rows.map(r => `<div style="display:flex;flex-direction:column;gap:4px;margin:8px 0;"><div style="display:flex;justify-content:space-between;gap:12px;font-size:12.5px;line-height:1.4;"><span>${rich(r.label)}</span><span style="${MONO}white-space:nowrap;">${esc(r.value)}</span></div>`
      + `<div style="height:4px;background:${HAIR};"><div style="height:4px;width:${Math.max(0, Math.min(100, +r.pct || 0))}%;background:${r.neg ? INK : V};"></div></div></div>`).join('')
    + (b.caption ? `<div style="font-size:11.5px;color:${MUTED};line-height:1.6;margin:10px 0 8px;">${rich(b.caption)}</div>` : '') + `</div>`,
  chart: b => `<div style="background:${PANEL};padding:16px 16px 6px;margin:0 0 14px;">`
    + (b.title ? `<div style="font-size:14px;font-weight:700;margin-bottom:8px;line-height:1.4;">${esc(b.title)}</div>` : '')
    // SVG를 인라인으로 넣어야 <title> 툴팁(유튜브 산점도 제목)이 마우스오버로 보인다. <img data:>로 넣으면 툴팁이 사라진다.
    + (b.svg ? `<div role="img" aria-label="${esc(b.title || '차트')}" style="width:100%;line-height:0;">${String(b.svg).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '')}</div>` : '')
    + (b.legend && b.legend.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11px;color:${SUB};margin:6px 0 10px;">` + b.legend.map(l => `<span><i style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;vertical-align:middle;background:${l.color};"></i>${esc(l.text)}</span>`).join('') + `</div>` : '')
    + (b.blocks ? renderBlocks(b.blocks) : '') + `</div>`,
  lifecycle: b => `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:6px 0 14px;">` + b.cols.map(c => {
    const col = LC[c.stage] || INK;
    return `<div style="display:flex;flex-direction:column;"><div style="display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;padding-bottom:8px;border-bottom:2px solid ${col};"><span style="width:8px;height:8px;flex:none;background:${col};"></span>${esc(c.stage)} (${c.items.length})</div>`
      + c.items.map(t => `<div style="font-size:12px;line-height:1.5;padding:7px 0;border-bottom:1px solid #ECEAF3;color:${TXT};">${esc(t)}</div>`).join('') + `</div>`;
  }).join('') + `</div>`,
  table: b => `<table style="width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.55;margin:10px 0 6px;">`
    + (b.caption ? `<caption style="caption-side:top;text-align:left;font-size:14px;font-weight:700;padding-bottom:8px;">${esc(b.caption)}</caption>` : '')
    + (b.head ? `<thead><tr>${b.head.map((h, i) => `<th style="text-align:left;font-weight:600;font-size:11.5px;padding:8px 6px;border-bottom:2px solid ${INK};vertical-align:bottom;${b.rankCol && i === 0 ? 'width:26px;' : ''}">${rich(h)}</th>`).join('')}</tr></thead>` : '')
    + `<tbody>${b.rows.map(r => `<tr>${r.map((c, i) => `<td style="padding:8px 6px;border-bottom:1px solid ${HAIR};vertical-align:top;${b.rankCol && i === 0 ? MONO + 'color:' + V + ';font-weight:600;' : ''}">${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
  kpis: b => `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:3px solid ${V};border-bottom:1px solid ${INK};margin-bottom:10px;">`
    + b.items.map(k => `<div style="padding:12px 10px 12px 0;display:flex;flex-direction:column;gap:4px;"><div style="font-size:11.5px;font-weight:600;line-height:1.35;">${esc(k.label)}</div><div style="${MONO}font-size:26px;font-weight:600;line-height:1.1;">${esc(k.value)}</div><div style="font-size:10.5px;color:${MUTED};line-height:1.4;">${rich(k.sub)}</div></div>`).join('') + `</div>`,
  desk: b => `<div style="display:flex;flex-direction:column;margin-bottom:10px;">` + b.items.map(d => `<div style="display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;padding:14px 0;border-top:1px solid ${RULE};"><div style="${MONO}font-size:11px;color:${V};padding-top:3px;">${esc(d.role)}</div><div style="display:flex;flex-direction:column;gap:6px;"><div style="font-size:15.5px;font-weight:700;line-height:1.45;">${rich(d.title)}</div>${(d.paras || []).map(p => P(p, 13.5)).join('')}</div></div>`).join('') + `</div>`,
  cards: b => b.items.map(c => `<div style="border-top:1px solid ${INK};padding:12px 0;display:flex;flex-direction:column;gap:6px;">${c.label ? `<div style="${MONO}font-size:11px;color:${V};">${esc(c.label)}</div>` : ''}${c.title ? `<div style="font-size:15.5px;font-weight:700;line-height:1.45;">${rich(c.title)}</div>` : ''}${(c.paras || []).map(p => P(p, 13.5)).join('')}</div>`).join(''),
  grid: b => `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start;margin-bottom:14px;">` + b.cols.map(c => `<div>${renderBlocks(c)}</div>`).join('') + `</div>`,
  stack: b => `<div style="display:flex;flex-direction:column;gap:24px;margin-bottom:14px;">` + b.cols.map(c => `<div>${renderBlocks(c)}</div>`).join('') + `</div>`,
  sources: b => `<div style="font-size:11.5px;color:${SUB};line-height:1.9;">${rich(b.html).replace(new RegExp('color:' + V, 'g'), 'color:' + INK)}</div>`,
  html: b => `<div>${rich(b.html)}</div>`,
  videos: b => V3.videos(b.items)
};
function renderBlocks(list) { return (list || []).map(b => (B[b.type] || B.html)(b)).join(''); }

function boardHtml(issue, interactive) {
  return `<div id="wr-board" data-issue="${esc(issue)}" style="display:flex;flex-direction:column;gap:14px;">`
    + `<p style="margin:0;font-size:13px;line-height:1.7;color:${SUB};">이 리포트에 대한 의견, 제보, 다음에 다뤘으면 하는 주제 등을 남겨주세요. 링크는 남길 수 없고, 부적절한 글은 예고 없이 숨김 처리될 수 있습니다.</p>`
    + `<form data-role="form" style="display:flex;flex-direction:column;gap:10px;background:${PANEL};padding:16px;"><textarea name="body" maxlength="500" placeholder="여기에 남겨주세요 (2~500자)" style="font-family:inherit;font-size:14px;line-height:1.6;background:#FFFFFF;border:1px solid ${RULE};padding:10px 12px;min-height:88px;resize:vertical;"></textarea>`
    + `<input type="text" name="website" tabindex="-1" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">`
    + `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><span data-role="count" style="${MONO}font-size:11px;color:${MUTED};">0 / 500</span><button type="submit" data-role="submit" style="font-family:inherit;font-size:13px;font-weight:700;color:#FFFFFF;background:${V};border:0;padding:10px 18px;cursor:pointer;">남기기</button></div><div data-role="msg" style="font-size:12.5px;min-height:18px;color:${V};"></div></form>`
    + `<div data-role="list" style="border-top:1px solid ${INK};"></div></div>`
    + (interactive ? `<script>(function(){var API='https://waiting-radar-board.joonho73.workers.dev',root=document.getElementById('wr-board'),ISSUE=root.dataset.issue,form=root.querySelector('[data-role=form]'),list=root.querySelector('[data-role=list]'),msg=root.querySelector('[data-role=msg]'),count=root.querySelector('[data-role=count]'),btn=root.querySelector('[data-role=submit]'),body=form.querySelector('[name=body]');function el(t,c,x){var e=document.createElement(t);if(c)e.style.cssText=c;if(x!=null)e.textContent=x;return e}function empty(t){list.innerHTML='';list.appendChild(el('div','font-size:13px;color:#666;padding:24px 0;text-align:center;',t))}function ago(s){var t=Date.parse(String(s).replace(' ','T')+'Z');if(isNaN(t))return s;var d=(Date.now()-t)/1000;if(d<60)return'방금';if(d<3600)return Math.floor(d/60)+'분 전';if(d<86400)return Math.floor(d/3600)+'시간 전';var x=new Date(t);return(x.getMonth()+1)+'/'+x.getDate()}function load(){empty('불러오는 중…');fetch(API+'/posts?limit=50').then(function(r){return r.json()}).then(function(d){var p=d.posts||[];if(!p.length)return empty('아직 글이 없어요. 첫 글을 남겨보세요.');list.innerHTML='';p.forEach(function(q){var it=el('div','padding:14px 0;border-bottom:1px solid #DCDAD3;'),m=el('div',"display:flex;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#666;margin-bottom:6px;");m.appendChild(el('b','color:#111;',q.nickname||'익명'));m.appendChild(el('span','',ago(q.created_at)));if(q.issue&&q.issue!=='all')m.appendChild(el('span','border:1px solid #DCDAD3;padding:0 6px;border-radius:20px;font-size:10px;','Issue '+q.issue));it.appendChild(m);it.appendChild(el('p','margin:0;font-size:14px;line-height:1.65;white-space:pre-wrap;word-break:break-word;',q.body));list.appendChild(it)})}).catch(function(){empty('게시판을 불러오지 못했어요.')})}body.addEventListener('input',function(){count.textContent=body.value.length+' / 500'});form.addEventListener('submit',function(e){e.preventDefault();msg.textContent='';btn.disabled=true;fetch(API+'/posts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({issue:ISSUE,body:body.value,website:form.querySelector('[name=website]').value})}).then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})}).then(function(res){if(!res.ok){msg.textContent=res.d.error||'잠시 후 다시 시도해 주세요.';return}body.value='';count.textContent='0 / 500';msg.textContent='남겨주셔서 고마워요.';load()}).catch(function(){msg.textContent='연결에 실패했어요.'}).then(function(){btn.disabled=false})});load()})();</script>` : '');
}

// ---------- Email summary (table layout, inline styles, no flex/grid — Outlook/Gmail/Naver safe)
const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
export function emailParts(data) {
  const e = data.email || {}, secs = data.sections || [];
  const find = id => secs.find(s => s.id === id);
  const firstText = s => { if (!s) return ''; const all = (s.blocks || []).concat(...(s.subsections || []).map(x => x.blocks || []));
    const t = all.find(b => b.type === 'text'); if (t) return t.html; const a = all.find(b => b.type === 'articles'); return a && a.items[0] && a.items[0].paras[0] || ''; };
  const hotS = find('hot'), hot = [];
  (hotS ? hotS.blocks : []).forEach(b => { if (b.type === 'articles') b.items.forEach(it => hot.push({ title: strip(it.title).replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, ''), src: it.src || '' })); });
  const srS = find('search'); let search = [];
  const tb = srS && srS.blocks.concat(...(srS.subsections || []).map(x => x.blocks)).find(b => b.type === 'table');
  if (tb) { const hd = (tb.head || []).map(strip); const ix = re => hd.findIndex(h => re.test(h));
    const kw = ix(/키워드|검색어/), cat = ix(/카테고리|분류/), dl = ix(/등락|변화|증감|전일/);
    search = tb.rows.slice(0, 10).map((r, i) => ({ rank: strip(r[0]) || String(i + 1), kw: strip(r[kw >= 0 ? kw : 1]), cat: cat >= 0 ? strip(r[cat]) : '', delta: dl >= 0 ? strip(r[dl]) : '' })); }
  const sp = find('special');
  return {
    brief: data.brief || [],
    top: data.top && { kicker: data.top.kicker || 'TOP STORY', title: strip(data.top.title), summary: e.topSummary || strip((data.top.paras || [])[0]) },
    side: data.side && { kicker: data.side.kicker || '', title: strip(data.side.title), summary: e.sideSummary || strip((data.side.paras || [])[0]) },
    hot: hot.slice(0, 6), search,
    special: sp && { title: sp.title + (sp.sub ? ' · ' + sp.sub : ''), summary: e.specialSummary || strip(firstText(sp)) }
  };
}
export function renderEmail(data, opts = {}) {
  const base = opts.assetBase || '', url = opts.reportUrl || '#', m = data.meta, x = emailParts(data);
  const F = "font-family:'SKT Sans Text','Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Malgun Gothic',sans-serif;";
  const FM = "font-family:'IBM Plex Mono',Menlo,Consolas,monospace;";
  const d = new Date(m.date + 'T00:00:00Z');
  const row = inner => `<tr><td style="padding:0 36px;">${inner}</td></tr>`;
  const label = (num, t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${INK};margin-top:28px;"><tr><td style="${F}padding-top:18px;font-size:19px;font-weight:700;color:${INK};">${esc(t)}</td><td align="right" style="${FM}padding-top:20px;font-size:11px;color:${V};">${num}</td></tr></table>`;
  let h = '';
  h += `<tr><td style="background:${V};padding:26px 36px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">`
    + `<tr><td style="${FM}font-size:11px;letter-spacing:1px;color:#FFFFFF;padding-bottom:10px;border-bottom:1px solid #8F7FE6;">${DOW[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}</td><td align="right" style="${FM}font-size:11px;color:#FFFFFF;padding-bottom:10px;border-bottom:1px solid #8F7FE6;">요약판</td></tr>`
    + `<tr><td style="${F}padding-top:16px;font-size:28px;line-height:34px;font-weight:700;color:#FFFFFF;">커뮤니티 &amp;<br>미디어플랫폼 리포트</td><td align="right" valign="bottom" style="padding-top:16px;"><img src="${base}assets/b-logo-white.png" width="34" height="38" alt="B" style="display:block;border:0;"></td></tr>`
    + `<tr><td colspan="2" style="${F}padding-top:12px;font-size:13px;line-height:20px;color:#E4E0FF;"><b style="color:#FFFFFF;">${esc(m.dateText)}</b>${m.coverage ? ' · ' + esc(m.coverage) : ''}</td></tr></table></td></tr>`;
  if (x.brief.length) h += `<tr><td style="background:${TINT};padding:22px 36px;border-bottom:3px solid ${V};"><div style="${FM}font-size:11px;letter-spacing:1px;color:${V};padding-bottom:10px;">오늘의 핵심</div>`
    + x.brief.map((b, i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:${i ? 12 : 0}px;"><tr><td width="22" valign="top" style="${FM}font-size:14px;font-weight:600;color:${V};">${i + 1}</td><td style="${F}font-size:16px;line-height:24px;font-weight:600;color:${INK};">${esc(strip(b.text))}</td></tr></table>`).join('') + `</td></tr>`;
  if (x.top) h += row(`<div style="${FM}font-size:11px;letter-spacing:1px;color:${V};padding-top:26px;">${esc(x.top.kicker)}</div><div style="${F}font-size:22px;line-height:31px;font-weight:700;color:${INK};padding-top:8px;">${esc(x.top.title)}</div><div style="${F}font-size:14px;line-height:24px;color:${TXT};padding-top:10px;">${esc(x.top.summary)}</div>`);
  if (x.side) h += row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;border-top:1px dashed #999999;"><tr><td style="padding-top:16px;"><div style="${FM}font-size:11px;color:${SUB};">SIDE STORY${x.side.kicker ? ' · ' + esc(x.side.kicker) : ''}</div><div style="${F}font-size:17px;line-height:25px;font-weight:700;color:${INK};padding-top:6px;">${esc(x.side.title)}</div><div style="${F}font-size:13.5px;line-height:23px;color:${TXT};padding-top:6px;">${esc(x.side.summary)}</div></td></tr></table>`);
  if (x.hot.length) h += row(label('02', '오늘의 화제') + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">`
    + x.hot.map((t, i) => `<tr><td width="30" valign="top" style="${FM}padding:11px 0;border-bottom:1px solid ${HAIR};font-size:13px;font-weight:600;color:${V};">${String(i + 1).padStart(2, '0')}</td><td style="${F}padding:11px 0;border-bottom:1px solid ${HAIR};font-size:14.5px;line-height:22px;color:${INK};font-weight:600;">${esc(t.title)}${t.src ? `<br><span style="${FM}font-size:10.5px;font-weight:400;color:${SUB};">${esc(t.src)}</span>` : ''}</td></tr>`).join('') + `</table>`);
  if (x.search.length) h += row(label('03', '네이버 검색어 Top 10') + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">`
    + x.search.map(s => `<tr><td width="30" style="${FM}padding:8px 0;border-bottom:1px solid ${HAIR};font-size:12px;color:${V};font-weight:600;">${esc(s.rank)}</td><td style="${F}padding:8px 0;border-bottom:1px solid ${HAIR};font-size:14px;color:${INK};font-weight:600;">${esc(s.kw)}</td><td width="64" style="${F}padding:8px 0;border-bottom:1px solid ${HAIR};font-size:12px;color:${SUB};">${esc(s.cat)}</td><td width="84" align="right" style="${FM}padding:8px 0;border-bottom:1px solid ${HAIR};font-size:12.5px;color:${INK};">${esc(s.delta)}</td></tr>`).join('') + `</table>`);
  if (x.special && x.special.summary) h += row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;background:${TINT};"><tr><td style="padding:18px 20px;"><div style="${FM}font-size:11px;letter-spacing:1px;color:${V};">오늘의 특집</div><div style="${F}font-size:17px;line-height:25px;font-weight:700;color:${INK};padding-top:6px;">${esc(x.special.title)}</div><div style="${F}font-size:13.5px;line-height:23px;color:${TXT};padding-top:6px;">${esc(x.special.summary)}</div></td></tr></table>`);
  h += `<tr><td align="center" style="padding:32px 36px 8px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${V};"><a href="${esc(url)}" target="_blank" style="${F}display:inline-block;padding:15px 40px;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">전체 리포트 보기 →</a></td></tr></table></td></tr>`
    + `<tr><td align="center" style="${F}padding:6px 36px 30px;font-size:12.5px;color:${SUB};">전체 리포트에서 TREND·SNS 교차검증·뉴스·데스크 시사점${(data.sections || []).some(s => s.id === 'voc') ? '·SKB VoC' : ''}을 볼 수 있고,<br>하단 익명 게시판에 의견·제보를 남길 수 있어요.</td></tr>`
    + `<tr><td style="background:${V};padding:16px 36px;${F}font-size:11px;line-height:17px;color:#E4E0FF;">본 메일은 커뮤니티 및 소셜 데이터를 자동 수집·요약한 것으로 원문 게시자의 의견과 무관합니다. © ${d.getUTCFullYear()} THE COMMUNITY &amp; PLATFORM DAILY</td></tr>`;
  const table = `<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" align="center" style="width:640px;max-width:100%;background:#FFFFFF;border-collapse:collapse;">${h}</table>`;
  if (opts.mode === 'fragment') return table;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>[커뮤니티 &amp; 미디어플랫폼 리포트] ${esc(m.date)} 요약</title></head><body style="margin:0;padding:0;background:#E7E5E0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#E7E5E0;"><tr><td align="center" style="padding:24px 8px;">${table}</td></tr></table></body></html>`;
}

export function renderReport(data, opts = {}) {
  const mode = opts.mode || 'full', base = opts.assetBase || '', preview = !!opts.preview;
  const m = data.meta, { plan } = validate(data);
  const d = new Date(m.date + 'T00:00:00Z'), doy = Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 864e5) + 1;
  const special = (data.sections || []).find(s => s.id === 'special');
  const chip = special ? (special.title + (special.sub ? ' · ' + special.sub : '')) : '';
  const slot = t => preview ? `<div style="border:1.5px dashed ${V};color:${V};padding:14px 16px;font-size:13px;line-height:1.6;margin:24px 0 0;">${esc(t)}</div>` : '';
  let h = '';
  h += `<div style="padding:28px 40px 30px;display:flex;flex-direction:column;gap:20px;background:${V};color:#FFFFFF;">`
    + `<div style="display:flex;justify-content:space-between;${MONO}font-size:11px;letter-spacing:.08em;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:10px;"><span>NO. ${d.getUTCFullYear()}-${String(doy).padStart(3, '0')}</span><span>${DOW[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}</span><span>INTERNAL</span></div>`
    + `<div style="display:flex;justify-content:space-between;align-items:flex-end;"><div style="${DISP}font-size:40px;font-weight:700;letter-spacing:-.035em;line-height:1.12;">커뮤니티 &amp;<br>미디어플랫폼 리포트</div><img src="${base}assets/b-logo-white.png" alt="B" style="height:52px;display:block;"></div>`
    + `<div style="display:flex;flex-direction:column;gap:8px;padding-top:14px;border-top:1px solid rgba(255,255,255,.4);"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;"><span style="font-size:15px;font-weight:700;">${esc(m.dateText)}</span>${chip ? `<span style="font-size:12px;font-weight:600;color:${V};background:#FFFFFF;padding:4px 9px;">${esc(chip)}</span>` : ''}</div>`
    + (m.coverage ? `<div style="font-size:12.5px;line-height:1.6;color:#E4E0FF;">${esc(m.coverage)}</div>` : '') + `</div></div>`;
  h += `<div style="padding:0 40px 36px;">`;
  if (data.brief && data.brief.length) {
    h += `<div class="cd-brief" style="margin:0 -40px;padding:26px 40px;display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;background:${TINT};border-bottom:3px solid ${V};"><div style="${MONO}font-size:11px;letter-spacing:.06em;color:${V};padding-top:4px;">00<br>오늘의 핵심</div><div style="display:flex;flex-direction:column;gap:14px;">`
      + data.brief.map(b => `<div style="display:flex;flex-direction:column;gap:3px;"><div style="font-size:17px;font-weight:600;line-height:1.45;">${rich(b.text)}</div>${b.meta ? `<div style="${MONO}font-size:11px;color:${MUTED};">${esc(b.meta)}</div>` : ''}</div>`).join('')
      + V3.heroKpis(data.heroKpis) + `</div></div>`;
  } else h += slot('00 오늘의 핵심 3줄 — 생성 단계에서 채울 자리 (brief: [{text, meta}] × 3)');
  const t = data.top;
  if (t) {
    h += V3.head(1, 'TOP & SIDE', '', false, 'top') + V3.story(t, false);
    if (data.side) h += V3.story(data.side, true);
  }
  let n = 1;
  const byId = {}; (data.sections || []).forEach(s => { (byId[s.id] = byId[s.id] || []).push(s); });
  const ids = plan.sections.concat((data.sections || []).map(s => s.id).filter(id => plan.sections.indexOf(id) < 0));
  ids.forEach(id => {
    const list = byId[id];
    if (!list) { if (plan.required.indexOf(id) >= 0 && id !== 'board') h += slot(SECTIONS[id].title + ' — 필수 섹션 누락'); return; }
    list.forEach(s => {
      n++;
      const def = SECTIONS[id] || {};
      if (id === 'sns' && byId.trend) { n--; return; }
      const merged = id === 'trend' && byId.sns;
      const title = merged ? '화력 & SNS 교차검증' : (s.title && id !== 'hot' && id !== 'signal' ? s.title : def.title || s.title);
      const sub = merged ? '' : (id === 'signal' ? def.sub : (s.sub != null ? s.sub : def.sub));
      h += V3.head(n, title, sub, s.pilot != null ? s.pilot : def.pilot, id);
      if (id === 'board') { h += boardHtml(m.issueId || ('community-' + m.date), mode === 'full'); return; }
      const R = renderBlocks;
      if (id === 'signal') h += V3.signal(s, R);
      else if (id === 'hot') h += V3.hot(s, R);
      else if (id === 'trend') h += V3.trendSns(s, byId.sns && byId.sns[0], R);
      else if (id === 'news') h += V3.news(s, R);
      else if (id === 'desk') h += V3.desk(s, R);
      else if (id === 'search') h += V3.search(s, R);
      else if (id === 'voc') h += V3.voc(s, R);
      else h += R(s.blocks);
      (s.subsections || []).forEach(ss => {
        h += `<div style="display:flex;align-items:baseline;gap:10px;margin:34px 0 10px;padding:10px 12px;background:${TINT};"><span style="font-size:16px;font-weight:700;">${esc(ss.title)}</span>${ss.sub ? `<span style="font-size:12.5px;color:${SUB};">${esc(ss.sub)}</span>` : ''}</div>` + V3.videos(ss.videos) + renderBlocks(ss.blocks);
      });
    });
  });
  h += `</div>`;
  h += `<div style="padding:18px 40px;background:${V};color:#FFFFFF;display:flex;flex-direction:column;gap:8px;"><div style="display:flex;justify-content:space-between;${MONO}font-size:11px;"><span>THE COMMUNITY &amp; PLATFORM DAILY</span><span>${esc(m.date)}</span></div><div style="font-size:11px;line-height:1.6;color:#E4E0FF;">${esc(data.footer || '본 리포트는 커뮤니티 및 소셜 데이터를 자동 수집·요약한 것으로 원문 게시자의 의견과 무관하며, 특정 이슈에 대한 편집부 입장을 대변하지 않습니다.')}</div></div>`;
  const card = `<div style="width:1080px;max-width:100%;margin:0 auto;background:#FFFFFF;color:${INK};${BODY}">${h}</div>`;
  if (mode === 'fragment') return card;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>커뮤니티 &amp; 미디어플랫폼 리포트 ${esc(m.date)}</title>`
    + `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap">`
    + `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`
    + `<style>body{margin:0;padding:32px 16px;background:#E7E5E0;-webkit-font-smoothing:antialiased;}a:hover{opacity:.7;}${V3.CSS}</style></head><body>${card}</body></html>`;
}
