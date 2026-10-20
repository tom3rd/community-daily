// Community Daily — v3 레이아웃(2026-10-21 적용): 여백·섹션 아이콘·그래픽, 근거는 <details>로 접기.
// render-2a.js가 불러 쓴다. 새 JSON 필드는 모두 선택이며, 없으면 기존 필드로 자연스럽게 대체한다(README 3-1절).

export const V = '#3617CE', INK = '#111111', TXT = '#2A2A2A', SUB = '#555555', MUTED = '#666666';
export const TINT = '#F1EFFC', PANEL = '#F7F6FB', HAIR = '#E3E0EE', SOFT = '#B9B0EE';
const MONO = "font-family:'IBM Plex Mono',monospace;";
export const LCOL = { 포착: '#E0A030', 조짐: '#E0A030', 확산: V, 정착: '#3E9B6A', 소멸: '#8A8F98' };
const CATC = { 시사: '#C0392B', 경제: '#1F7A8C', 연예: '#C2185B', 스포츠: '#2E7D32', 리빙: '#B7791F', IT: '#5E35B1', 미디어: '#5E35B1' };

export const esc = t => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
export const rich = h => String(h == null ? '' : h)
  .replace(/<a\s+href=/g, `<a target="_blank" rel="noopener noreferrer" style="color:${V};text-decoration:underline;" href=`)
  .replace(/<b>/g, `<b style="color:${INK};font-weight:700;">`);
const Pw = (h, sz = 14.5) => `<p style="margin:12px 0;max-width:820px;font-size:${sz}px;line-height:1.78;color:${TXT};">${rich(h)}</p>`;

// ---------- 공통 조각
const ICON = {
  top: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.6 1.6-3.8 2-6 1 1 1.8 2.2 2 3.6.6-2.6.6-5 1-7.6z"/>',
  signal: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="M12 12l6-6"/>',
  hot: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  trend: '<path d="M5 20V11M11 20V5M17 20v-6M3 20h18"/>',
  special: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5l4.5 2.5-4.5 2.5z"/>',
  news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  desk: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  voc: '<path d="M4 5h16v11H9l-5 4z"/><path d="M12 8.5v3"/><path d="M12 13.8v.2"/>',
  sources: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  board: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>'
};
export function head(num, title, sub, pilot, id) {
  const ic = ICON[id] ? `<span style="width:38px;height:38px;border-radius:50%;background:${TINT};display:inline-flex;align-items:center;justify-content:center;flex:none;"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="${V}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[id]}</svg></span>` : '';
  return `<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;padding-top:22px;margin-top:56px;border-top:1px solid ${INK};margin-bottom:18px;">`
    + `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;">${ic}<span style="font-size:21px;font-weight:700;letter-spacing:-.02em;">${esc(title)}</span>`
    + (sub ? `<span style="font-size:13px;color:${SUB};">${esc(sub)}</span>` : '')
    + (pilot ? `<span style="${MONO}font-size:10.5px;color:#FFFFFF;background:${V};padding:2px 6px;">PILOT</span>` : '')
    + `</div><div style="${MONO}font-size:11px;color:${V};">${String(num).padStart(2, '0')}</div></div>`;
}
export const details = (label, inner) => `<details class="cd-d" style="margin:8px 0 4px;"><summary style="cursor:pointer;font-size:12px;color:${V};font-weight:600;">${esc(label)}</summary><div style="background:#FAFAFC;border-left:2px solid #DCDAD3;padding:8px 14px;margin-top:6px;">${inner}</div></details>`;
const linksRow = ls => ls && ls.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin:10px 0 2px;">${ls.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" style="color:${V};font-size:12px;font-weight:600;">${esc(l.text)}</a>`).join('')}</div>` : '';
const so = t => t ? `<div style="background:${TINT};padding:12px 16px;font-size:14px;line-height:1.65;margin:14px 0 10px;"><b style="color:${V};margin-right:10px;">그래서</b>${rich(t)}</div>` : '';
const chip = (t, c) => `<span style="display:inline-block;border:1px solid ${c};color:${c};font-size:11px;padding:1px 8px;border-radius:20px;white-space:nowrap;line-height:17px;">${esc(t)}</span>`;
const stageColor = tag => LCOL[Object.keys(LCOL).find(k => String(tag || '').indexOf(k) >= 0)] || V;

export function thumb(v) {
  const id = esc(v.id);
  return `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" style="display:flex;flex-direction:column;gap:6px;text-decoration:none;color:${INK};">`
    + `<span style="position:relative;display:block;aspect-ratio:16/9;background:linear-gradient(135deg,#E8E6F1,#D6D1EE);overflow:hidden;"><img src="https://img.youtube.com/vi/${id}/mqdefault.jpg" alt="" loading="lazy" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover;display:block;">`
    + `<span style="position:absolute;left:8px;bottom:8px;width:26px;height:26px;border-radius:50%;background:rgba(17,17,17,.75);color:#FFFFFF;font-size:10px;display:flex;align-items:center;justify-content:center;">▶</span></span>`
    + `<span style="font-size:12.5px;font-weight:700;line-height:1.35;">${esc(v.title)}</span>${v.meta ? `<span style="${MONO}font-size:11px;color:${MUTED};">${esc(v.meta)}</span>` : ''}</a>`;
}
export const videos = list => list && list.length ? `<div class="cd-th" style="display:grid;grid-template-columns:repeat(${Math.min(4, list.length)},minmax(0,1fr));gap:14px;margin:14px 0 18px;">${list.map(thumb).join('')}</div>` : '';

// ---------- 0. 30초 요약 숫자 카드
export function heroKpis(list) {
  if (!list || !list.length) return '';
  return `<div class="cd-k4" style="display:grid;grid-template-columns:repeat(${Math.min(4, list.length)},minmax(0,1fr));gap:14px;margin-top:16px;">`
    + list.map(k => `<div style="background:#FFFFFF;padding:12px 14px;border-top:3px solid ${V};"><div style="${MONO}font-size:26px;font-weight:600;line-height:1.1;">${esc(k.value)}</div><div style="font-size:12.5px;font-weight:700;margin-top:4px;">${esc(k.label)}</div>${k.sub ? `<div style="font-size:11px;color:${MUTED};margin-top:2px;">${esc(k.sub)}</div>` : ''}</div>`).join('') + `</div>`;
}

// ---------- 1. TOP / SIDE
function fig(f) {
  if (!f) return '';
  const rows = f.rows || [], mx = Math.max(...rows.map(r => +r.value || 0), 1);
  const chart = rows.length ? `<div style="background:${PANEL};padding:16px 18px;">${f.title ? `<div style="font-size:13px;font-weight:700;margin-bottom:10px;">${esc(f.title)}</div>` : ''}`
    + rows.map(r => `<div style="display:grid;grid-template-columns:120px 1fr 56px;gap:10px;align-items:center;font-size:12.5px;padding:5px 0;"><span>${esc(r.label)}</span><span style="height:10px;background:#E8E6F1;display:block;"><span style="display:block;height:10px;width:${((+r.value || 0) / mx * 100).toFixed(1)}%;background:${r.hl ? V : SOFT};"></span></span><span style="${MONO}text-align:right;">${esc(r.text != null ? r.text : r.value)}</span></div>`).join('')
    + (f.caption ? `<div style="font-size:11px;color:#888;margin-top:8px;">${esc(f.caption)}</div>` : '') + `</div>` : '';
  const bigs = (f.bigs || []).map(b => `<div style="border-top:3px solid ${V};padding:14px 4px 0;display:flex;flex-direction:column;gap:6px;"><div style="${MONO}font-size:40px;font-weight:600;color:${V};line-height:1;">${esc(b.value)}</div><div style="font-size:13px;line-height:1.5;font-weight:600;">${esc(b.label)}${b.sub ? `<br><span style="font-weight:400;color:#777;font-size:12px;">${esc(b.sub)}</span>` : ''}</div></div>`).join('');
  const cols = (chart ? ['minmax(0,1.5fr)'] : []).concat((f.bigs || []).map(() => '1fr')).join(' ');
  return `<div class="cd-fig" style="display:grid;grid-template-columns:${cols};gap:18px;margin:18px 0 20px;align-items:stretch;">${chart}${bigs}</div>`;
}
function quote(q) {
  if (!q || !q.text) return '';
  const v = q.video ? `<div>${thumb(q.video)}</div>` : '';
  return `<div class="cd-q" style="display:grid;grid-template-columns:${v ? '220px ' : ''}1fr;gap:22px;align-items:center;margin:22px 0;padding:18px 0;border-top:1px solid #ECEAF3;border-bottom:1px solid #ECEAF3;">${v}<div>`
    + `<div style="font-size:56px;line-height:.6;color:${V};font-family:Georgia,serif;height:24px;">“</div><div style="font-size:20px;font-weight:700;line-height:1.45;letter-spacing:-.02em;">${esc(q.text)}</div>`
    + (q.meta ? `<div style="font-size:12px;color:#777;margin:6px 0 10px;">${esc(q.meta)}</div>` : '')
    + (q.more && q.more.text ? `<div style="font-size:14px;color:#444;">“${esc(q.more.text)}”${q.more.meta ? ` <span style="font-size:11.5px;color:#999;margin-left:6px;">${esc(q.more.meta)}</span>` : ''}</div>` : '') + `</div></div>`;
}
export function story(t, side) {
  const lead = t.lead && t.lead.length ? t.lead : null;
  let h = `<div style="${MONO}font-size:11px;letter-spacing:.04em;color:${side ? SUB : V};">${esc(side ? (t.kicker && /SIDE/.test(t.kicker) ? t.kicker : 'SIDE STORY · ' + (t.kicker || '')) : (t.kicker || 'TOP STORY'))}</div>`
    + `<div style="font-family:'SKT Sans Display','SKT Sans Text','Pretendard Variable',Pretendard,sans-serif;font-size:${side ? 19 : 25}px;font-weight:700;line-height:1.35;letter-spacing:-.02em;margin:6px 0 4px;">${rich(t.title)}</div>`;
  h += fig(t.fig);
  h += (lead || t.paras || []).map(p => Pw(p)).join('');
  h += quote(t.quote) + so(t.so) + linksRow(t.links);
  if (lead && t.paras && t.paras.length) h += details(`원문 ${t.paras.length}문단 전체 보기`, t.paras.map(p => Pw(p, 13.5)).join(''));
  return side ? `<div style="margin-top:22px;padding-top:16px;border-top:1px dashed #999999;">${h}</div>` : `<div style="padding-top:4px;">${h}</div>`;
}

// ---------- 2. 리틀 시그널
export function signal(s, renderBlocks) {
  const watch = (s.blocks || []).filter(b => b.type === 'watch').flatMap(b => b.items);
  const capText = (s.blocks || []).filter(b => b.type === 'caption' || b.type === 'text').map(b => strip(b.html)).join(' ');
  const cnt = k => watch.filter(w => String(w.tag || '').indexOf(k) >= 0).length;
  const m = capText.match(/소멸 판정\s*(\d+)\s*건/);
  const dead = m ? +m[1] : cnt('소멸');
  const box = (n, l, sub, c, off) => `<div style="flex:1;border:1px solid ${HAIR};border-top:4px solid ${c};padding:12px 14px;background:${off ? '#FAFAFA' : '#FFFFFF'};${off ? 'margin-left:14px;' : ''}"><div style="${MONO}font-size:28px;font-weight:600;color:${c};line-height:1;">${n}</div><div style="font-size:14px;font-weight:700;margin-top:4px;">${l}</div><div style="font-size:11.5px;color:#777;">${sub}</div></div>`;
  const arrow = `<div class="cd-arr" style="align-self:center;color:#BBBBBB;font-size:20px;">→</div>`;
  const pipe = `<div class="cd-pipe" style="display:flex;align-items:stretch;gap:10px;margin:4px 0 20px;">${box(cnt('포착') + cnt('조짐'), '포착', '처음 보인 신호', LCOL.포착)}${arrow}${box(cnt('확산'), '확산', '다른 곳으로 번짐', LCOL.확산)}${arrow}${box(cnt('정착'), '정착', '3일 이상 지속', LCOL.정착)}${box(dead, '소멸', '재등장 없음', '#999999', true)}</div>`;
  let h = pipe, done = false;
  (s.blocks || []).forEach(b => {
    if (b.type === 'watch') {
      h += `<div class="cd-2" style="display:grid;grid-template-columns:1fr 1fr;gap:22px 30px;">` + b.items.map(w => {
        const c = stageColor(w.tag);
        return `<div style="border-top:3px solid ${c};padding-top:10px;">${chip(w.tag, c)}<div style="font-size:13.5px;line-height:1.72;color:${TXT};margin-top:6px;">${rich(w.html).replace(/<b style="color:#111111;font-weight:700;">/, '<b style="color:#111111;font-weight:700;font-size:15px;">')}</div></div>`;
      }).join('') + `</div>`;
      done = true;
    } else if (b.type === 'text' && !done) h += `<p style="font-size:13.5px;line-height:1.7;color:#444444;margin:0 0 14px;max-width:820px;">${rich(b.html)}</p>`;
    else h += renderBlocks([b]);
  });
  return h;
}

// ---------- 3. 오늘의 화제 (so가 있으면 카드형)
export function hot(s, renderBlocks) {
  const arts = (s.blocks || []).find(b => b.type === 'articles');
  if (!arts || !arts.items.some(it => it.so)) return renderBlocks(s.blocks);
  const cards = arts.items.map((it, i) => {
    const title = it.short || strip(it.title).replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/, '').split(' — ')[0];
    return `<div style="display:flex;gap:12px;border-top:1px solid ${INK};padding-top:14px;"><div style="${MONO}font-size:13px;color:${V};font-weight:600;">${String(i + 1).padStart(2, '0')}</div><div style="flex:1;min-width:0;">`
      + `<div style="font-size:15.5px;font-weight:700;line-height:1.4;">${esc(title)}</div>`
      + `<div style="font-size:13.5px;line-height:1.6;color:${TXT};margin:4px 0;">${rich(it.so)}</div>`
      + `<div style="display:flex;justify-content:space-between;gap:8px;${MONO}font-size:11px;color:${MUTED};"><span style="color:${INK};font-weight:600;">${esc(it.stat || '')}</span><span>${esc(it.src || '')}</span></div>`
      + details('원문 요약 펼치기', `<div style="font-size:14px;font-weight:700;margin:4px 0;">${rich(it.title)}</div>` + (it.paras || []).map(p => Pw(p, 13.5)).join('')) + `</div></div>`;
  }).join('');
  return `<div class="cd-2" style="display:grid;grid-template-columns:1fr 1fr;gap:20px 30px;">${cards}</div>` + renderBlocks((s.blocks || []).filter(b => b !== arts));
}

// ---------- 4. 화력 & SNS 교차검증 (trend + sns 합본)
export function trendSns(trend, sns, renderBlocks) {
  const all = (trend ? trend.blocks : []).flatMap(b => b.type === 'grid' ? b.cols.flat() : [b]);
  const fire = all.find(b => b.type === 'bars');
  const sig = sns && sns.signal;
  let left = '';
  if (fire) left = `<div><div style="font-size:13px;font-weight:700;margin-bottom:8px;">${esc(fire.title || '커뮤니티 화력')}</div>`
    + fire.rows.slice(0, 6).map(r => `<div style="display:grid;grid-template-columns:150px 1fr 56px;gap:8px;align-items:center;font-size:12.5px;padding:4px 0;"><span>${rich(r.label)}</span><span style="height:6px;background:${HAIR};display:block;"><span style="display:block;height:6px;width:${Math.max(1.5, +r.pct || 0)}%;background:${V};"></span></span><span style="${MONO}text-align:right;">${esc(r.value)}</span></div>`).join('') + `</div>`;
  let right = '';
  const mark = v => { const t = String(v || '').trim(); return /강|●/.test(t) ? '●' : /약|○/.test(t) ? '○' : '–'; };
  if (sig && sig.length) {
    right = `<div><div style="font-size:13px;font-weight:700;margin-bottom:8px;">플랫폼별 반응 (● 강 ○ 약 – 미수집)</div><table style="width:100%;border-collapse:collapse;font-size:12.5px;"><tr>${['이슈', '유튜브', '틱톡', '인스타', '판정'].map((x, i) => `<th style="text-align:${i && i < 4 ? 'center' : 'left'};font-size:11.5px;padding:7px 6px;border-bottom:2px solid ${INK};">${x}</th>`).join('')}</tr>`
      + sig.map(r => `<tr><td style="padding:7px 6px;border-bottom:1px solid ${HAIR};font-weight:700;">${esc(r.issue)}</td>${[r.yt, r.tt, r.ig].map(v => `<td style="padding:7px 6px;border-bottom:1px solid ${HAIR};text-align:center;color:${V};">${mark(v)}</td>`).join('')}<td style="padding:7px 6px;border-bottom:1px solid ${HAIR};">${esc(r.verdict || '')}</td></tr>`).join('') + `</table></div>`;
  } else if (sns) {
    const t = sns.blocks.find(b => b.type === 'table');
    if (t) right = `<div>${renderBlocks([t])}</div>`;
  }
  const body = `<div class="cd-2" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">${left}${right}</div>`;
  const rest = (trend ? renderBlocks(trend.blocks) : '') + (sns ? renderBlocks(sns.blocks) : '');
  return body + details('수치 상세 보기 (구글 트렌드·검색량·라이프사이클·유튜브 산점도·틱톡·인스타)', rest);
}

// ---------- 6. 뉴스 (제목 목록 + 접기)
export function news(s, renderBlocks) {
  const items = [];
  const walk = bs => (bs || []).forEach(b => { if (b.type === 'articles') items.push(...b.items); else if (b.cols) b.cols.forEach(c => walk(Array.isArray(c) ? c : [c])); });
  walk(s.blocks);
  if (!items.length) return renderBlocks(s.blocks);
  return `<ul class="cd-col2" style="columns:2;column-gap:28px;margin:0;padding-left:18px;font-size:13.5px;line-height:1.55;">${items.map(a => `<li style="break-inside:avoid;margin-bottom:6px;">${rich(a.title)}</li>`).join('')}</ul>`
    + details('기사 요약 보기', renderBlocks(s.blocks));
}

// ---------- 7. 데스크 시사점 (제목 + 한 문장)
export function desk(s, renderBlocks) {
  const d = (s.blocks || []).find(b => b.type === 'desk');
  if (!d) return renderBlocks(s.blocks);
  const first = p => { const t = strip(p); const m = t.match(/^.+?[다요]\./); return m ? m[0] : t.slice(0, 80); };
  return `<div class="cd-3" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;">` + d.items.map(x => `<div style="border-top:3px solid ${V};background:${PANEL};padding:12px 16px;"><div style="${MONO}font-size:11px;color:${V};">${esc(x.role)}</div><div style="font-size:15px;font-weight:700;margin:4px 0;line-height:1.4;">${esc(strip(String(x.title).replace(/<br\s*\/?>/g, ' ')))}</div><div style="font-size:13px;line-height:1.6;color:${TXT};">${rich(x.brief || first((x.paras || [])[0]))}</div></div>`).join('') + `</div>`
    + details('시사점 전문 보기', renderBlocks(s.blocks));
}

// ---------- 8. 네이버 검색어 Top 20 (비고 노출, 2단)
export function search(s, renderBlocks) {
  const t = (s.blocks || []).find(b => b.type === 'table');
  if (!t) return renderBlocks(s.blocks);
  const hd = (t.head || []).map(strip), ix = re => hd.findIndex(x => re.test(x));
  const kI = ix(/검색어|키워드/), cI = ix(/분류|카테고리/), dI = ix(/등락|변화/), nI = ix(/비고/);
  const row = (r, i) => {
    let note = nI >= 0 ? strip(r[nI]) : '', idx = '', low = /저지수/.test(note);
    const m = note.match(/\s*\(([\d.]+)→([\d.]+)\)\s*$/);
    if (m) { note = note.slice(0, m.index); idx = `${m[1]}→${m[2]}`; low = low || +m[1] < 2; }
    note = note.replace(/\((시사|저지수)\)/g, '').replace(/^\d{1,2}\/\d{1,2}\s+/, '').trim();
    const cat = cI >= 0 ? strip(r[cI]) : '', c = CATC[cat] || '#777777';
    return `<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #ECEAF3;"><span style="${MONO}font-size:13px;font-weight:600;color:${V};width:20px;flex:none;padding-top:1px;">${esc(strip(r[0]) || i + 1)}</span><div style="flex:1;min-width:0;">`
      + `<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:14px;font-weight:700;">${esc(strip(r[kI >= 0 ? kI : 1]))}</span>${cat ? `<span style="font-size:10.5px;border:1px solid ${c};color:${c};padding:0 6px;border-radius:10px;line-height:16px;">${esc(cat)}</span>` : ''}${low ? `<span style="font-size:10px;background:#F1F1F1;color:#888888;padding:0 5px;border-radius:3px;line-height:16px;">저지수</span>` : ''}<span style="margin-left:auto;${MONO}font-size:13px;font-weight:600;">${esc(dI >= 0 ? strip(r[dI]) : '')}</span></div>`
      + `<div class="cd-nt" style="font-size:12.5px;color:#444444;line-height:1.45;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(note)}${idx ? `<span style="${MONO}font-size:10.5px;color:#AAAAAA;margin-left:6px;">${idx}</span>` : ''}</div></div></div>`;
  };
  const rows = t.rows.slice(0, 20), half = Math.ceil(rows.length / 2);
  let down = s.down;
  if (!down) {
    const cap = (s.blocks || []).filter(b => b.type === 'caption').map(b => strip(b.html)).join(' ');
    const mm = cap.match(/하락 폭이 큰 검색어\s*:\s*([^.]+?)(?:\.|$)/);
    down = mm ? mm[1].split(/,\s*/).map(x => { const z = x.trim().match(/^(.*?)\s*([−-][\d.]+%)$/); return z ? { kw: z[1], delta: z[2].replace('-', '−') } : null; }).filter(Boolean) : [];
  }
  const dn = down.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;margin:14px 0 6px;"><span style="font-size:12px;font-weight:700;color:#555555;margin-right:4px;">▼ 많이 내린 검색어</span>${down.map(d => `<span style="font-size:12px;background:${PANEL};padding:3px 9px;border-radius:12px;">${esc(d.kw)} <b style="${MONO}font-weight:600;color:#1F5FA8;">${esc(d.delta)}</b></span>`).join('')}</div>` : '';
  return `<div style="font-size:11.5px;color:${MUTED};margin:0 0 8px;">${esc(t.caption || '네이버 데이터랩 전일 대비 상승률')} · 실검 아님 · 회색 숫자는 지수 변화(전일→당일)</div>`
    + `<div class="cd-2" style="display:grid;grid-template-columns:1fr 1fr;gap:0 30px;"><div>${rows.slice(0, half).map(row).join('')}</div><div>${rows.slice(half).map((r, i) => row(r, half + i)).join('')}</div></div>` + dn
    + details('집계 방법 보기', renderBlocks((s.blocks || []).filter(b => b.type !== 'table')));
}

// ---------- 9. SKB VoC (분량 유지, 쉬운 설명, 표 가독성)
const VOCL = [[/^SKB 긍정/, 'SKB 칭찬'], [/^SKB 부정/, 'SKB 불만'], [/^SKB 중립·?문의/, 'SKB 문의']];
const vhead = t => `<div style="font-size:15px;font-weight:700;margin:24px 0 10px;padding-left:10px;border-left:3px solid ${V};">${esc(t)}</div>`;
const th = (x, c) => `<th style="text-align:${c ? 'center' : 'left'};font-size:11.5px;font-weight:600;padding:8px;background:${TINT};border-bottom:2px solid ${V};white-space:nowrap;">${rich(x)}</th>`;
const td = (x, st = '') => `<td style="padding:9px 8px;border-bottom:1px solid ${HAIR};vertical-align:top;${st}">${rich(x)}</td>`;
function vocTable(b) {
  const hd = (b.head || []).map(strip), cap = b.caption ? `<div style="font-size:14px;font-weight:700;margin:20px 0 8px;">${esc(b.caption)}</div>` : '';
  const wrap = inner => `${cap}<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.55;">${inner}</table></div>`;
  if (hd[0] && /이슈 유형/.test(hd[0])) {
    const ci = hd.findIndex(x => /건수/.test(x));
    return wrap(`<tr>${hd.map((x, i) => th(x, i === ci)).join('')}</tr>` + b.rows.map(r => {
      const zero = ['0', '-', ''].indexOf(strip(r[ci])) >= 0;
      return `<tr style="${zero ? '' : 'background:#FFFDF6;'}">${r.map((c, i) => i === ci
        ? td(`<span style="display:inline-block;min-width:22px;text-align:center;${MONO}font-size:12px;padding:1px 6px;border-radius:10px;background:${zero ? '#EEEEEE' : V};color:${zero ? '#999999' : '#FFFFFF'};">${esc(strip(c))}</span>`, 'text-align:center;')
        : td(c, zero ? 'color:#9A98A6;' : (i === 0 ? 'font-weight:700;' : ''))).join('')}</tr>`;
    }).join('')) + `<div style="font-size:11.5px;color:${MUTED};margin-top:6px;">건수가 있는 유형은 진하게, 0건인 유형은 흐리게 표시했다.</div>`;
  }
  if (hd[0] && /채널/.test(hd[0]) && hd.some(x => /결과/.test(x))) {
    const ri = hd.findIndex(x => /결과/.test(x));
    return wrap(`<tr>${th(hd[0])}${th('상태')}${hd.slice(1).map(x => th(x)).join('')}</tr>` + b.rows.map(r => {
      const res = strip(r[ri]), ok = /^성공/.test(res), miss = /미수집|실패/.test(res);
      const badge = `<span style="font-size:11px;padding:2px 8px;border-radius:10px;white-space:nowrap;background:${ok ? '#E5F4EC' : miss ? '#F3F1F1' : '#FFF4D6'};color:${ok ? '#2E7D52' : miss ? '#999999' : '#8A6D00'};">${ok ? '성공' : miss ? (/실패/.test(res) ? '실패' : '미수집') : '확인'}</span>`;
      return `<tr>${td(r[0], 'font-weight:700;')}${td(badge)}${r.slice(1).map((c, i) => td(i + 1 === ri ? String(c).replace(/^성공\s*·?\s*/, '') : c, i + 1 === ri ? '' : 'color:#666666;font-size:12px;')).join('')}</tr>`;
    }).join(''));
  }
  if (hd[0] && /날짜/.test(hd[0])) {
    const ni = hd.findIndex(x => /부정/.test(x));
    return wrap(`<tr>${hd.map((x, i) => th(x, i > 0)).join('')}</tr>` + b.rows.map((r, k) => `<tr style="${k === 0 ? `background:${TINT};font-weight:600;` : ''}">${r.map((c, i) => td(i === 0 && k === 0 ? strip(c) + ' (오늘)' : c, i === 0 ? 'font-weight:700;' : `text-align:center;${MONO}${i === ni && strip(c) !== '0' ? 'color:#C0392B;font-weight:700;' : 'color:' + V + ';'}`)).join('')}</tr>`).join(''));
  }
  return wrap(`<tr>${hd.map(x => th(x)).join('')}</tr>` + b.rows.map(r => `<tr>${r.map(c => td(c)).join('')}</tr>`).join(''));
}
function splitLink(html) {
  const m = String(html).match(/\s*<a href="([^"]+)">([^<]*원문[^<]*)<\/a>\s*$/);
  return m ? [String(html).slice(0, m.index), m[1].replace(/&amp;/g, '&')] : [String(html), null];
}
export function voc(s, renderBlocks) {
  const bs = s.blocks || [];
  let h = '', kp = [], glanceDone = false, textCount = 0;
  const flushK = () => {
    if (!kp.length) return;
    h += `<div class="cd-3" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:12px 0;">` + kp.map(k => {
      let l = k.label; VOCL.forEach(([re, to]) => { l = String(l).replace(re, to); });
      return `<div style="background:${PANEL};padding:12px 14px;border-top:3px solid ${V};"><div style="${MONO}font-size:26px;font-weight:600;line-height:1.1;">${esc(k.value)}</div><div style="font-size:12.5px;font-weight:700;margin-top:4px;">${esc(l)}</div><div style="font-size:11px;color:${MUTED};margin-top:2px;">${rich(k.sub)}</div></div>`;
    }).join('') + `</div>`;
    kp = [];
  };
  bs.forEach((b, i) => {
    if (b.type !== 'kpis') flushK();
    if (b.type === 'kpis') {
      if (!glanceDone && s.glance && s.glance.length) { h += `<div style="background:${TINT};padding:14px 18px;margin:12px 0;"><div style="${MONO}font-size:11px;color:${V};margin-bottom:6px;">한눈에 보기</div><ul style="margin:0;padding-left:18px;font-size:14.5px;line-height:1.8;">${s.glance.map(g => `<li>${rich(g)}</li>`).join('')}</ul></div>`; glanceDone = true; }
      kp.push(...b.items);
    } else if (b.type === 'text') {
      textCount++;
      if (textCount === 1) h += `<div style="font-size:11.5px;color:${MUTED};line-height:1.6;margin:0 0 10px;">${rich(b.html)}</div>`;
      else h += Pw(b.html) + (textCount === 2 ? `<div style="font-size:12px;color:#555555;background:#FAFAFC;border:1px solid #ECEAF3;padding:8px 12px;margin:8px 0 14px;">용어: <b>해지방어</b> = 해지하려는 고객에게 혜택을 제안해 붙잡는 것 · <b>통신사 불문</b> = 어느 통신사인지와 상관없이 인터넷·IPTV 불편을 말한 글 · <b>사칭·환승사기</b> = 통신사를 사칭해 가입 전환을 유도하는 영업</div>` : '');
    } else if (b.type === 'table') h += vocTable(b);
    else if (b.type === 'subhead') h += vhead(String(b.text).replace('대표 부정 글', '대표 불만 글').replace('중립·문의 글', '문의 글'));
    else if (b.type === 'grid' && b.cols.flat().every(x => x.type === 'cards')) {
      const cards = b.cols.flat().flatMap(x => x.items);
      h += `<div class="cd-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">` + cards.map(c => {
        const [body, url] = splitLink((c.paras || []).join(' '));
        return `<div style="background:${PANEL};padding:14px 16px;">${c.label ? `<div style="${MONO}font-size:11px;color:#666666;">${esc(c.label)}</div>` : ''}<div style="font-size:15px;font-weight:700;line-height:1.45;margin:4px 0;">${rich(c.title)}</div>`
          + `<p style="font-size:13.5px;line-height:1.65;color:${TXT};margin:4px 0;">${rich(c.summary || body)}</p>`
          + (url ? `<div><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${V};font-size:12.5px;font-weight:600;">원문 보기 ↗</a></div>` : '')
          + (c.summary ? details('자세한 요약', Pw(body, 13)) : '') + `</div>`;
      }).join('') + `</div>`;
    } else if (b.type === 'watch') {
      h += b.items.map(w => {
        const [body, url] = splitLink(w.html), tm = body.match(/<b>(.*?)<\/b>/);
        const title = tm ? tm[1] : '', rest = w.summary || body.replace(/<b>.*?<\/b>\s*—?\s*/, '');
        return `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-top:1px solid #ECEAF3;">${chip(w.tag, '#888888')}<div style="flex:1;">${title ? `<div style="font-weight:700;font-size:14px;">${title}</div>` : ''}<div style="font-size:13.5px;line-height:1.65;color:${TXT};">${rich(rest)}${url ? ` <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${V};font-size:12.5px;font-weight:600;">원문 ↗</a>` : ''}</div>`
          + (w.summary ? details('자세한 요약', Pw(body, 13)) : '') + `</div></div>`;
      }).join('');
    } else if (b.type === 'desk') {
      h += `<div class="cd-3" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;">` + b.items.map(x => `<div style="border-top:3px solid ${V};background:${PANEL};padding:12px 16px;"><div style="${MONO}font-size:11px;color:${V};">${esc(x.role)}</div><div style="font-size:15px;font-weight:700;margin:4px 0;line-height:1.4;">${rich(x.title)}</div>${(x.paras || []).map(p => `<div style="font-size:13px;line-height:1.65;color:${TXT};">${rich(p)}</div>`).join('')}</div>`).join('') + `</div>`;
    } else h += renderBlocks([b]);
  });
  flushK();
  return h;
}

export const CSS = `.cd-d summary{list-style:none}.cd-d summary::-webkit-details-marker{display:none}.cd-d summary::before{content:'＋ '}.cd-d[open] summary::before{content:'－ '}`
  + `@media(max-width:720px){.cd-brief{grid-template-columns:1fr!important;gap:8px!important}.cd-2,.cd-fig,.cd-q{grid-template-columns:1fr!important}.cd-3,.cd-k4,.cd-th{grid-template-columns:1fr 1fr!important}.cd-col2{columns:1!important}.cd-pipe{flex-wrap:wrap}.cd-pipe>div{flex:1 1 40%!important;margin-left:0!important}.cd-arr{display:none}.cd-nt{white-space:normal!important}}`;
