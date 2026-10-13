"""Convert legacy class-based community daily HTML -> 2a JSON (data/YYYY-MM-DD.json)."""
import sys, re, json
from bs4 import BeautifulSoup, NavigableString, Tag

src, out, date = sys.argv[1], sys.argv[2], sys.argv[3]
soup = BeautifulSoup(open(src, encoding='utf-8').read(), 'html.parser')


def clean(node):
    """Inner HTML keeping only <b>, <a href>, <br>."""
    parts = []
    for c in node.children:
        if isinstance(c, NavigableString):
            if c.__class__.__name__ in ('Comment',):
                continue
            parts.append(str(c).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))
        elif isinstance(c, Tag):
            if c.name == 'br':
                parts.append('<br>')
            elif c.name in ('b', 'strong'):
                parts.append('<b>' + clean(c) + '</b>')
            elif c.name == 'a' and c.get('href'):
                href = c['href'].replace('&', '&amp;').replace('"', '&quot;')
                parts.append(f'<a href="{href}">' + clean(c) + '</a>')
            elif c.name in ('script', 'style', 'svg'):
                continue
            else:
                parts.append(clean(c))
    return re.sub(r'\s+', ' ', ''.join(parts)).strip()


txt = lambda n: re.sub(r'\s+', ' ', n.get_text(' ', strip=True)).strip()


def bars(wrap):
    rows = []
    for r in wrap.select('.bar-row'):
        fill = r.select_one('.bar-fill')
        m = re.search(r'width:\s*([\d.]+)%', fill.get('style', '')) if fill else None
        rows.append({'label': clean(r.select_one('.bar-label')), 'value': txt(r.select_one('.bar-val')),
                     'pct': float(m.group(1)) if m else 0, 'neg': bool(fill) and 'alt' in (fill.get('class') or [])})
    b = {'type': 'bars', 'title': txt(wrap.select_one('.chart-title')) if wrap.select_one('.chart-title') else '', 'rows': rows}
    cap = wrap.find('div', class_='caption', recursive=False)
    if cap: b['caption'] = clean(cap)
    return b


def table(t):
    cap = t.find('caption')
    trs = t.find_all('tr')
    head = [clean(x) for x in trs[0].find_all(['th', 'td'])] if trs and trs[0].find('th') else None
    rows = [[clean(x) for x in tr.find_all(['td', 'th'])] for tr in (trs[1:] if head else trs)]
    b = {'type': 'table', 'caption': txt(cap) if cap else '', 'rows': rows}
    if head: b['head'] = head
    return b


def articles_from(container):
    """h3.article-h + following <p> siblings -> articles items."""
    items, cur, extra = [], None, []
    for c in container.children:
        if not isinstance(c, Tag): continue
        if c.name == 'h3' and 'article-h' in (c.get('class') or []):
            s = c.select_one('.src'); srcs = txt(s) if s else ''
            if s: s.extract()
            cur = {'title': clean(c), 'src': srcs, 'paras': []}; items.append(cur)
        elif c.name == 'p' and cur is not None:
            cur['paras'].append(clean(c))
        else:
            extra.append(c)
    return items, extra


def lifecycle(board):
    cols = []
    for col in board.select('.lc-col'):
        stage = re.sub(r'\s*\(\d+\)\s*$', '', txt(col.select_one('.lc-head')))
        items = [txt(i) for i in col.select('.lc-item')]
        cols.append({'stage': stage, 'items': [i for i in items if i]})
    return {'type': 'lifecycle', 'cols': cols}


def box_card(box):
    num = box.select_one('.num'); h4 = box.find('h4')
    return {'label': txt(num) if num else '', 'title': clean(h4) if h4 else '', 'paras': [clean(p) for p in box.find_all('p')]}


def kpis(k):
    items = []
    for box in k.select('.box'):
        divs = [d for d in box.find_all('div', recursive=False)]
        sub = [d for d in divs if not (d.get('class') or [])]
        items.append({'label': txt(box.select_one('.subhead-mini')), 'value': txt(box.select_one('.big')),
                      'sub': clean(sub[0]) if sub else ''})
    return {'type': 'kpis', 'items': items}


def generic(el):
    """Map one element to a list of blocks."""
    cls = el.get('class') or []
    if el.name == 'p':
        return [{'type': 'caption' if 'caption' in cls else 'text', 'html': clean(el)}]
    if 'caption' in cls:
        return [{'type': 'caption', 'html': clean(el)}]
    if 'subhead-mini' in cls:
        return [{'type': 'subhead', 'text': txt(el)}]
    if el.name == 'ul' and 'watch-list' in cls:
        items = []
        for li in el.find_all('li', recursive=False):
            tg = li.select_one('.tag')
            if tg: tag = txt(tg); tg.extract()
            else:
                b = li.find('b'); m = re.match(r'(\S+)\s', txt(li)); tag = m.group(1) if m else ''
                if not b and m: pass
            items.append({'tag': tag, 'html': clean(li)})
        if not any(i['tag'] for i in items) or all(not li.select_one('.tag') for li in []):
            pass
        return [{'type': 'watch', 'items': items}]
    if el.name == 'table':
        return [table(el)]
    if 'chart-wrap' in cls:
        if el.select_one('.lifecycle-board'):
            return [{'type': 'chart', 'title': txt(el.select_one('.chart-title')), 'legend': [], 'blocks': [lifecycle(el.select_one('.lifecycle-board'))]}]
        svg = el.find('svg')
        if svg:
            b = {'type': 'chart', 'title': txt(el.select_one('.chart-title')), 'svg': str(svg), 'legend': [], 'blocks': []}
            cap = el.find('div', class_='caption', recursive=False)
            return [b] + ([{'type': 'caption', 'html': clean(cap)}] if cap else [])
        return [bars(el)]
    if 'grid2' in cls:
        cols = []
        for c in el.find_all(recursive=False):
            ccls = c.get('class') or []
            if 'box' in ccls: cols.append([{'type': 'cards', 'items': [box_card(c)]}])
            elif 'chart-wrap' in ccls: cols.append(generic(c))
            else: cols.append(blocks_of(c))
        return [{'type': 'grid', 'cols': cols}]
    if 'cols' in cls:
        items, extra = articles_from(el)
        if items: return [{'type': 'articles', 'items': items}] + sum((generic(x) for x in extra), [])
        return [{'type': 'text', 'html': clean(p)} for p in el.find_all('p', recursive=False)]
    if 'box3' in cls:
        return [{'type': 'desk', 'items': [{'role': c['label'], 'title': c['title'], 'paras': c['paras']} for c in map(box_card, el.select('.box'))]}]
    if 'kpi3' in cls:
        return [kpis(el)]
    if 'sources' in cls:
        return [{'type': 'sources', 'html': re.sub(r'(<br>\s*){2,}', '<br><br>', clean(el))}]
    if el.name == 'h3' and 'article-h' in cls:
        s = el.select_one('.src'); srcs = txt(s) if s else ''
        if s: s.extract()
        return [{'type': 'articles', 'items': [{'title': clean(el), 'src': srcs, 'paras': []}]}]
    if el.name in ('style', 'script'): return []
    return [{'type': 'html', 'html': clean(el)}]


def blocks_of(container):
    out = []
    kids = [c for c in container.children if isinstance(c, Tag)]
    if any(c.name == 'h3' and 'article-h' in (c.get('class') or []) for c in kids):
        items, extra = articles_from(container)
        out.append({'type': 'articles', 'items': items})
        kids = extra
    for c in kids:
        out += generic(c)
    return out


def section_title(st):
    sp = st.find('span')
    sub = ''
    if sp and 'pilot' not in (sp.get('class') or []):
        sub = re.sub(r'^·\s*', '', txt(sp)); sp.extract()
    elif sp: sp.extract()
    return re.sub(r'^\d+(-\d+)?\s*·\s*', '', txt(st)), sub


# ---------- meta / top / side
dl = [txt(s) for s in soup.select('.dateline span')]
data = {'meta': {'date': date, 'dateText': dl[0], 'coverage': dl[-1], 'issueId': f'community-{date}'}}
hb = soup.select_one('.headline-block')
main = hb.find('div', recursive=False)
def story(el, title_tag):
    k = txt(el.select_one('.kicker'))
    return {'kicker': re.sub(r'^SIDE STORY\s*·\s*', '', k), 'title': clean(el.find(title_tag)),
            'paras': [clean(p) for p in el.find_all('p', recursive=False)],
            'links': [{'text': txt(a), 'url': a['href']} for a in el.select('.dlinks a')]}
data['top'] = story(main, 'h1')
data['side'] = story(hb.select_one('.side-story'), 'h2')

ID = {'오늘의 화제': 'hot', '리틀 시그널': 'signal', 'TREND': 'trend', 'SNS 플랫폼': 'sns', '오늘의 특집': 'special',
      '비즈니스': 'news', '데스크': 'desk', '네이버 검색어': 'search', 'SKB VoC': 'voc', '익명 게시판': 'board'}
sections = []
for sec in soup.select('.page > section, body > section') or soup.find_all('section'):
    st = sec.find('div', class_='section-title', recursive=False)
    if not st:
        if sec.find('div', class_='sources', recursive=False) and not sec.select_one('.headline-block'):
            sections.append({'id': 'sources', 'title': '출처', 'blocks': generic(sec.find('div', class_='sources', recursive=False))})
        continue
    title, sub = section_title(st)
    sid = next((v for k, v in ID.items() if title.startswith(k)), None)
    if not sid: raise SystemExit('unknown section ' + title)
    s = {'id': sid, 'title': title, 'sub': sub, 'blocks': []}
    if sid == 'voc': s['pilot'] = True
    if sid == 'board':
        sections.append(s); continue
    kids = [c for c in sec.children if isinstance(c, Tag) and c is not st]
    if sid == 'special':
        # inner section-titles become subsections
        cur = s['blocks']; s['subsections'] = []
        pending_h3 = []
        for c in kids:
            if 'section-title' in (c.get('class') or []):
                t2, sub2 = section_title(c)
                ss = {'title': t2, 'blocks': []}
                if sub2: ss['sub'] = sub2
                s['subsections'].append(ss); cur = ss['blocks']
            elif c.name == 'h3' and 'article-h' in (c.get('class') or []):
                cur += generic(c); pending_h3 = cur[-1]['items']
            elif 'cols' in (c.get('class') or []) and pending_h3 and not c.find('h3'):
                pending_h3[0]['paras'] += [clean(p) for p in c.find_all('p', recursive=False)]; pending_h3 = []
            else:
                cur += generic(c); pending_h3 = []
        if not s['subsections']: del s['subsections']
    elif sid == 'news':
        g = sec.select_one('.grid2')
        cols = [blocks_of(c) for c in g.find_all(recursive=False)]
        s['blocks'] = [{'type': 'stack', 'cols': cols}] + sum((generic(c) for c in kids if c is not g), [])
    else:
        for c in kids: s['blocks'] += generic(c)
    sections.append(s)

data['sections'] = sections
fn = soup.select_one('.footer-note')
if fn: data['footer'] = txt(fn)
json.dump(data, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', [ (s['id'], len(s['blocks']), len(s.get('subsections', []))) for s in sections])
