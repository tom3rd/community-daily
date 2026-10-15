// node templates/build-kit.mjs report.json --asset-base https://www.tom3rd.com/daily/ --out out/report.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { renderDoc, validateDoc } from './render-kit.js';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const file = args.find(a => a.endsWith('.json'));
if (!file) { console.error('사용법: node templates/build-kit.mjs report.json [--asset-base URL] [--out FILE]'); process.exit(1); }
const data = JSON.parse(readFileSync(file, 'utf8'));
const { issues } = validateDoc(data);
if (issues.length) { console.error('점검 실패:\n- ' + issues.join('\n- ')); if (!args.includes('--force')) process.exit(2); }
const out = opt('--out') || `out/${data.meta.issueId}.html`;
mkdirSync(dirname(out), { recursive: true });
const html = renderDoc(data, { assetBase: opt('--asset-base') || 'https://www.tom3rd.com/daily/' });
writeFileSync(out, html);
console.log(`완료: ${out} (${html.length.toLocaleString()}자, 게시판 ${(html.match(/id="wr-board"/g) || []).length}개)`);
