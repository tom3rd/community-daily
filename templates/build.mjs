// node templates/build.mjs data/2026-10-14.json --asset-base https://www.tom3rd.com/daily/ [--report-url https://www.send.co/a/XXXXXXXX] [--out out]
// 리포트(웹)는 반복되는 인라인 스타일을 클래스로 묶어 크기를 줄인다(화면은 동일). 메일은 메일 프로그램 호환을 위해 인라인 그대로 둔다.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { renderReport, renderEmail, validate } from './render-2a.js';

const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const file = args.find(a => a.endsWith('.json'));
if (!file) { console.error('사용법: node templates/build.mjs data/YYYY-MM-DD.json [--asset-base URL] [--report-url URL] [--out DIR]'); process.exit(1); }
const data = JSON.parse(readFileSync(file, 'utf8'));
const { issues } = validate(data);
if (issues.length) { console.error('점검 실패:\n- ' + issues.join('\n- ')); if (!args.includes('--force')) process.exit(2); }
const out = opt('--out') || 'out', assetBase = opt('--asset-base') || '', date = data.meta.date;
const reportUrl = opt('--report-url') || `community_daily_report_${date}.html`;

// 같은 style 값이 2번 이상 나오면 클래스(.zN)로 바꾼다. <svg> 내부는 건드리지 않는다.
function compactStyles(html) {
  const parts = html.split(/(<svg[\s\S]*?<\/svg>)/g);
  const count = new Map();
  parts.forEach((p, i) => { if (i % 2) return; for (const m of p.matchAll(/ style="([^"]*)"/g)) count.set(m[1], (count.get(m[1]) || 0) + 1); });
  const cls = new Map(); let n = 0;
  for (const [s, c] of count) if (c >= 2 && s.length > 12) cls.set(s, 'z' + (n++).toString(36));
  const body = parts.map((p, i) => i % 2 ? p : p.replace(/<([a-zA-Z0-9]+)([^>]*?) style="([^"]*)"/g, (all, tag, attrs, s) => {
    if (!cls.has(s) || /\sclass="/.test(attrs)) return all;
    return `<${tag}${attrs} class="${cls.get(s)}"`;
  })).join('');
  const css = [...cls].map(([s, c]) => `.${c}{${s.replace(/<\/style/gi, '')}}`).join('');
  return body.replace('</style></head>', css + '</style></head>');
}

mkdirSync(out, { recursive: true });
const report = compactStyles(renderReport(data, { mode: 'full', assetBase }));
writeFileSync(`${out}/community_daily_report_${date}.html`, report);
writeFileSync(`${out}/community_daily_email_${date}.html`, renderEmail(data, { mode: 'full', assetBase, reportUrl }));
const tips = (report.match(/<title>/g) || []).length - 1;
console.log(`완료: ${out}/community_daily_report_${date}.html (${report.length.toLocaleString()}자, 산점도 툴팁 ${tips}개), ${out}/community_daily_email_${date}.html`);
