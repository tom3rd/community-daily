// Report Kit (2a) — 커뮤니티 데일리 2a 디자인을 모든 Send 리포트용으로 일반화한 렌더러.
// JSON -> 인라인 스타일 HTML. 사용법은 kit/KIT.md 참고.
//   import { renderDoc, validateDoc } from './render-kit.js';
//   const html = renderDoc(data, { assetBase: 'https://www.tom3rd.com/daily/' });

const V = '#3617CE', INK = '#111111', TXT = '#2A2A2A', SUB = '#555555', MUTED = '#666666';
const TINT = '#F1EFFC', PANEL = '#F7F6FB', RULE = '#DCDAD3', HAIR = '#E3E0EE';
const UP = '#C8312B', DOWN = '#1F6FD1';
const MONO = "font-family:'IBM Plex Mono',monospace;";
const DISP = "font-family:'SKT Sans Display','SKT Sans Text','Pretendard Variable',Pretendard,sans-serif;";
const BODY = "font-family:'SKT Sans Text','Pretendard Variable',Pretendard,sans-serif;";
const LC = { 조짐: '#E0A030', 포착: '#E0A030', 확산: V, 정착: '#3E9B6A', 소멸: '#8A8F98', HOT: V, RISING: '#E0A030', 긍정: '#3E9B6A', 부정: UP, 중립: '#8A8F98' };
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const LOGOS = { b: 'assets/b-logo-white.png', btv: 'assets/btv-logo-white.png' };

const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = h => String(h == null ? '' : h)
  .replace(/<a\s+href=/g, `<a target="_blank" rel="noopener noreferrer" style="color:${V};text-decoration:underline;" href=`)
  .replace(/<b>/g, `<b style="color:${INK};font-weight:700;">`);
const P = (h, sz = 14) => `<p style="margin:6px 0 10px;font-size:${sz}px;line-height:1.75;color:${TXT};">${rich(h)}</p>`;
const mono = (t, extra = '') => `<span style="${MONO}font-size:11px;color:${V};letter-spacing:.04em;${extra}">${esc(t)}</span>`;

const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
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
  // ---- 킷 확장 블록 ----
  image: b => `<figure style="margin:6px 0 16px;"><img src="${esc(b.src)}" alt="${esc(b.alt || '')}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:auto;display:block;background:${PANEL};${b.ratio ? 'aspect-ratio:' + b.ratio + ';object-fit:cover;' : ''}">`
    + (b.caption || b.credit ? `<figcaption style="display:flex;justify-content:space-between;gap:12px;font-size:11.5px;color:${MUTED};line-height:1.6;margin-top:6px;"><span>${rich(b.caption || '')}</span>${b.credit ? `<span style="${MONO}font-size:10.5px;white-space:nowrap;">${esc(b.credit)}</span>` : ''}</figcaption>` : '') + `</figure>`,
  picks: b => b.items.map((p, i) => {
    const big = b.hero && i === 0;
    const c = LC[p.tag && Object.keys(LC).find(k => p.tag.indexOf(k) >= 0)] || V;
    const meta = `<div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;"><span style="${MONO}font-size:11px;color:#FFFFFF;background:${c};padding:2px 6px;">${esc(p.rank || p.tag || String(i + 1).padStart(2, '0'))}</span>${p.place ? `<span style="${MONO}font-size:11px;color:${SUB};">${esc(p.place)}</span>` : ''}</div>`;
    const txt = `${meta}<div style="font-size:${big ? 22 : 16.5}px;font-weight:700;line-height:1.4;letter-spacing:-.01em;margin-top:6px;">${rich(p.name)}</div>`
      + (p.why ? P(p.why, big ? 14.5 : 13.5) : '')
      + (p.proof ? `<div style="${MONO}font-size:11px;color:${V};line-height:1.6;">${rich(p.proof)}</div>` : '')
      + (p.credit ? `<div style="font-size:10.5px;color:${MUTED};margin-top:4px;">${esc(p.credit)}</div>` : '');
    const img = p.img ? `<img src="${esc(p.img)}" alt="${esc(strip(p.name))}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'" style="width:100%;${big ? 'aspect-ratio:16/10;' : 'aspect-ratio:1/1;'}object-fit:cover;display:block;background:${PANEL};">` : '';
    if (big) return `<div style="border-top:1px solid ${INK};padding:14px 0 6px;display:flex;flex-direction:column;gap:10px;">${img}<div>${txt}</div></div>`;
    return `<div style="display:grid;grid-template-columns:${img ? '120px ' : ''}minmax(0,1fr);gap:16px;border-top:1px solid ${INK};padding:14px 0;">${img ? `<div>${img}</div>` : ''}<div>${txt}</div></div>`;
  }).join(''),
  bignum: b => `<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:end;background:${TINT};border-top:3px solid ${V};padding:18px 18px 16px;margin:0 0 14px;">`
    + `<div style="display:flex;flex-direction:column;gap:6px;"><div style="${MONO}font-size:11px;letter-spacing:.06em;color:${V};">${esc(b.label)}</div><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;"><span style="${DISP}font-size:54px;font-weight:700;line-height:1;letter-spacing:-.03em;">${esc(b.value)}</span>${b.unit ? `<span style="font-size:15px;color:${SUB};">${esc(b.unit)}</span>` : ''}${b.delta ? `<span style="${MONO}font-size:14px;font-weight:600;color:${/^[-−▼]/.test(b.delta) ? DOWN : UP};">${esc(b.delta)}</span>` : ''}</div>${b.sub ? `<div style="font-size:13px;line-height:1.6;color:${TXT};">${rich(b.sub)}</div>` : ''}</div>`
    + (b.status ? `<div style="font-size:13px;font-weight:700;color:#FFFFFF;background:${V};padding:6px 10px;white-space:nowrap;">${esc(b.status)}</div>` : '') + `</div>`,
  scale: b => { const pct = Math.max(0, Math.min(100, ((+b.value - b.min) / (b.max - b.min)) * 100));
    return `<div style="margin:4px 0 16px;"><div style="position:relative;height:8px;background:linear-gradient(90deg,${DOWN},#D9D6E8 50%,${UP});"><div style="position:absolute;left:calc(${pct}% - 6px);top:-5px;width:12px;height:18px;background:${INK};"></div></div>`
      + `<div style="display:flex;justify-content:space-between;${MONO}font-size:10.5px;color:${MUTED};margin-top:6px;">${(b.labels || [b.min, b.max]).map(l => `<span>${esc(l)}</span>`).join('')}</div></div>`; },
  timeline: b => `<div style="display:flex;flex-direction:column;margin:4px 0 12px;">` + b.items.map(t => `<div style="display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;padding:10px 0;border-top:1px solid ${RULE};font-size:13px;line-height:1.65;"><span style="${MONO}font-size:11px;color:${V};padding-top:2px;">${esc(t.date)}</span><span>${rich(t.html)}</span></div>`).join('') + `</div>`,
  links: b => `<div style="display:flex;flex-direction:column;margin:4px 0 12px;">` + b.items.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="display:grid;grid-template-columns:${l.date ? '120px ' : ''}minmax(0,1fr) auto;gap:20px;padding:10px 0;border-top:1px solid ${RULE};color:${INK};text-decoration:none;font-size:13.5px;line-height:1.5;">${l.date ? `<span style="${MONO}font-size:11px;color:${V};padding-top:2px;">${esc(l.date)}</span>` : ''}<span><b style="font-weight:700;">${esc(l.title)}</b>${l.sub ? `<br><span style="font-size:12px;color:${SUB};">${esc(l.sub)}</span>` : ''}</span><span style="${MONO}font-size:11px;color:${V};">→</span></a>`).join('') + `</div>`,
  details: b => b.items.map(d => `<details style="border-top:1px solid ${INK};padding:12px 0;"${d.open ? ' open' : ''}><summary style="cursor:pointer;list-style:none;display:flex;gap:10px;align-items:baseline;">${d.label ? `<span style="${MONO}font-size:11px;color:${V};">${esc(d.label)}</span>` : ''}<span style="font-size:15.5px;font-weight:700;line-height:1.45;">${rich(d.title)}</span><span style="${MONO}font-size:11px;color:${MUTED};margin-left:auto;">펼치기</span></summary><div style="padding-top:8px;">${renderBlocks(d.blocks || (d.paras || []).map(p => ({ type: 'text', html: p })))}</div></details>`).join('')
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

export const BLOCK_TYPES = Object.keys(B);

export function validateDoc(data) {
  const issues = [], m = data.meta || {};
  if (!m.series) issues.push('meta.series(리포트 이름) 없음');
  if (!m.date || !/^\d{4}-\d{2}-\d{2}$/.test(m.date)) issues.push('meta.date(YYYY-MM-DD) 없음');
  if (!m.issueId) issues.push('meta.issueId(익명 게시판 키) 없음');
  if (!(data.sections || []).length) issues.push('sections 비어 있음');
  if (!(data.sections || []).some(s => s.id === 'board')) issues.push('board 섹션 없음 (모든 Send 리포트 필수)');
  const walk = (list, where) => (list || []).forEach((b, i) => {
    if (!B[b.type]) issues.push(`${where}[${i}]: 알 수 없는 블록 "${b.type}"`);
    if (b.cols) b.cols.forEach((c, j) => walk(c, `${where}[${i}].cols[${j}]`));
    if (b.blocks) walk(b.blocks, `${where}[${i}].blocks`);
  });
  (data.sections || []).forEach(s => { walk(s.blocks, s.id); (s.subsections || []).forEach((ss, i) => walk(ss.blocks, `${s.id}.sub${i}`)); });
  return { issues };
}

export function renderDoc(data, opts = {}) {
  const base = opts.assetBase || '', interactive = opts.interactive !== false;
  const m = data.meta, W = m.width || 1080;
  const d = new Date(m.date + 'T00:00:00Z'), doy = Math.round((d - Date.UTC(d.getUTCFullYear(), 0, 1)) / 864e5) + 1;
  const logo = m.logo === undefined ? null : m.logo;
  const logoSrc = logo ? (LOGOS[logo] ? base + LOGOS[logo] : logo) : '';
  const seriesHtml = esc(m.series).replace(/\n/g, '<br>');
  const no = m.no || `NO. ${d.getUTCFullYear()}-${String(doy).padStart(3, '0')}`;
  let h = '';
  // masthead
  h += `<div style="padding:28px 40px 30px;display:flex;flex-direction:column;gap:20px;background:${V};color:#FFFFFF;">`
    + `<div style="display:flex;justify-content:space-between;gap:12px;${MONO}font-size:11px;letter-spacing:.08em;border-bottom:1px solid rgba(255,255,255,.4);padding-bottom:10px;"><span>${esc(no)}</span><span>${DOW[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}</span><span>${esc(m.label || 'REPORT')}</span></div>`
    + `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;"><div style="display:flex;flex-direction:column;gap:8px;">${m.kicker ? `<div style="${MONO}font-size:11px;letter-spacing:.08em;color:#E4E0FF;">${esc(m.kicker)}</div>` : ''}<div style="${DISP}font-size:${m.seriesSize || 40}px;font-weight:700;letter-spacing:-.035em;line-height:1.12;">${seriesHtml}</div></div>${logoSrc ? `<img src="${esc(logoSrc)}" alt="" style="height:52px;display:block;flex:none;">` : ''}</div>`
    + `<div style="display:flex;flex-direction:column;gap:8px;padding-top:14px;border-top:1px solid rgba(255,255,255,.4);"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap;"><span style="font-size:15px;font-weight:700;">${esc(m.dateText || m.date)}</span>${m.chip ? `<span style="font-size:12px;font-weight:600;color:${V};background:#FFFFFF;padding:4px 9px;">${esc(m.chip)}</span>` : ''}</div>`
    + (m.coverage ? `<div style="font-size:12.5px;line-height:1.6;color:#E4E0FF;">${rich(m.coverage).replace(new RegExp('color:' + V, 'g'), 'color:#FFFFFF')}</div>` : '') + `</div></div>`;
  h += `<div style="padding:0 40px 36px;">`;
  if (data.intro) h += `<div style="padding:24px 0 4px;font-size:14.5px;line-height:1.8;color:${TXT};">${rich(data.intro)}</div>`;
  if (data.brief && data.brief.length) {
    h += `<div style="margin:${data.intro ? '16px' : '0'} -40px 0;padding:26px 40px;display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;background:${TINT};border-bottom:3px solid ${V};"><div style="${MONO}font-size:11px;letter-spacing:.06em;color:${V};padding-top:4px;">00<br>${esc(m.briefLabel || '핵심 요약')}</div><div style="display:flex;flex-direction:column;gap:14px;">`
      + data.brief.map(b => `<div style="display:flex;flex-direction:column;gap:3px;"><div style="font-size:17px;font-weight:600;line-height:1.45;">${rich(b.text)}</div>${b.meta ? `<div style="${MONO}font-size:11px;color:${MUTED};">${esc(b.meta)}</div>` : ''}</div>`).join('')
      + `</div></div>`;
  }
  const t = data.top;
  if (t) {
    h += `<div style="padding:28px 0 6px;display:flex;flex-direction:column;gap:12px;"><div style="${MONO}font-size:11px;letter-spacing:.06em;color:${V};">01 ${esc(t.kicker || 'TOP STORY')}</div><div style="${DISP}font-size:27px;font-weight:700;line-height:1.32;letter-spacing:-.02em;">${rich(t.title)}</div><div>${renderBlocks(t.blocks)}${(t.paras || []).map(p => P(p, 14.5)).join('')}`
      + (t.links && t.links.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:4px;">${t.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="color:${V};font-size:12px;font-weight:600;">${esc(l.text)}</a>`).join('')}</div>` : '') + `</div>`;
    const s = data.side;
    if (s) h += `<div style="display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;padding-top:16px;margin-top:4px;border-top:1px dashed #999999;"><div style="${MONO}font-size:11px;line-height:1.6;color:${SUB};">SIDE<br>${esc(s.kicker || '')}</div><div style="display:flex;flex-direction:column;gap:4px;"><div style="font-size:17px;font-weight:700;line-height:1.45;">${rich(s.title)}</div>${(s.paras || []).map(p => P(p, 13.5)).join('')}`
      + (s.links && s.links.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:4px;">${s.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="color:${V};font-size:12px;font-weight:600;">${esc(l.text)}</a>`).join('')}</div>` : '') + `</div></div>`;
    h += `</div>`;
  }
  let n = t ? 1 : 0;
  (data.sections || []).forEach(s => {
    n++;
    h += head(n, s.title || (s.id === 'board' ? '익명 게시판' : ''), s.sub, s.pilot);
    if (s.id === 'board') { h += boardHtml(m.issueId, interactive); return; }
    h += renderBlocks(s.blocks);
    (s.subsections || []).forEach((ss, i) => {
      h += `<div style="display:flex;align-items:baseline;gap:10px;margin:26px 0 10px;padding:10px 12px;background:${TINT};"><span style="${MONO}font-size:11px;color:${V};">${String(n).padStart(2, '0')}-${i + 1}</span><span style="font-size:16px;font-weight:700;">${esc(ss.title)}</span>${ss.sub ? `<span style="font-size:12.5px;color:${SUB};">${esc(ss.sub)}</span>` : ''}</div>` + renderBlocks(ss.blocks);
    });
  });
  h += `</div>`;
  const f = data.footer || {};
  h += `<div style="padding:18px 40px;background:${V};color:#FFFFFF;display:flex;flex-direction:column;gap:8px;"><div style="display:flex;justify-content:space-between;gap:12px;${MONO}font-size:11px;"><span>${esc(f.left || String(m.series).replace(/\n/g, ' ').toUpperCase())}</span><span>${esc(f.right || m.date)}</span></div>`
    + (f.text ? `<div style="font-size:11px;line-height:1.6;color:#E4E0FF;">${rich(f.text).replace(new RegExp('color:' + V, 'g'), 'color:#FFFFFF')}</div>` : '')
    + (f.links && f.links.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:11.5px;">${f.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="color:#FFFFFF;text-decoration:underline;">${esc(l.text)}</a>`).join('')}</div>` : '') + `</div>`;
  const card = `<div class="rk" style="width:${W}px;max-width:100%;margin:0 auto;background:#FFFFFF;color:${INK};${BODY}">${h}</div>`;
  if (opts.mode === 'fragment') return card;
  const title = m.title || `${String(m.series).replace(/\n/g, ' ')} ${m.date}`;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>`
    + `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap">`
    + `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`
    + `<style>body{margin:0;padding:32px 16px;background:#E7E5E0;-webkit-font-smoothing:antialiased;}a:hover{opacity:.7;}details>summary::-webkit-details-marker{display:none;}`
    + `@media (max-width:620px){body{padding:0;}.rk>div{padding-left:20px!important;padding-right:20px!important;}.rk [style*="grid-template-columns:120px"]{grid-template-columns:minmax(0,1fr)!important;gap:6px!important;}.rk [style*="repeat(3,minmax(0,1fr))"],.rk [style*="minmax(0,1fr) minmax(0,1fr)"]{grid-template-columns:minmax(0,1fr)!important;}.rk [style*="repeat(4,minmax(0,1fr))"]{grid-template-columns:repeat(2,minmax(0,1fr))!important;}.rk [style*="margin:0 -40px"]{margin-left:-20px!important;margin-right:-20px!important;padding-left:20px!important;padding-right:20px!important;}.rk [style*="font-size:40px"]{font-size:30px!important;}.rk table{display:block;overflow-x:auto;}}</style></head><body>${card}</body></html>`;
}
