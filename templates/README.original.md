# 커뮤니티 데일리 2a — 자동 생성 템플릿

수집·요약 에이전트는 **HTML이 아닌 JSON**(`data/YYYY-MM-DD.json`)만 만든다. 디자인은 `render-2a.js`가 전담한다.

```
수집 → 요약(JSON) → validate() → renderReport(data, {mode:'full', assetBase}) → 발송/웹 게시
```

## 발송 흐름

1. `renderReport(data, {mode:'full', assetBase})`로 만든 전체 리포트를 웹에 게시한다(URL 확보).
2. `renderEmail(data, {mode:'full', assetBase, reportUrl})`로 만든 요약 메일을 발송한다. 메일은 표 레이아웃이라 Outlook·Gmail·네이버 메일에서 깨지지 않는다.
   - 요약 메일 구성: 오늘의 핵심 3줄 → TOP·SIDE 요약 → 오늘의 화제 6건 제목 → 네이버 검색어 Top 10 → 요일 특집 요약(평일) → **전체 리포트 보기** 버튼
   - 요약문을 따로 쓰고 싶으면 `data.email = {topSummary, sideSummary, specialSummary}`를 넣는다. 없으면 각 섹션의 첫 문단을 쓴다.
   - 메일에서는 이미지·폰트 경로가 반드시 절대 URL이어야 한다(`assetBase`). 메일 프로그램은 웹폰트를 대부분 무시하므로 맑은 고딕으로 대체된다.

## 요일 플랜

공통 순서: 오늘의 핵심 3줄 → TOP·SIDE → 화제 TOP 6 → 리틀 시그널 → TREND → SNS 교차검증 → **요일 특집** → 비즈니스&미디어 뉴스 → 데스크 시사점 → 네이버 검색어 Top 20 → SKB VoC(파일럿) → 출처 → 익명 게시판

| 요일 | 특집 (`sections[id=special]`) |
|---|---|
| 월 | 미디어산업 위클리 — subsections 6개: 플랫폼별 시청률·순위 / 금주의 신작 / 다음 주 예정작 / 6개월 이슈 캘린더 / 사업자 동향 / 신규·부가서비스 |
| 화 | SNS TRENDS |
| 수 | 맛집·음식 급상승 |
| 목 | 팝업스토어·핫플레이스 |
| 금 | 쇼핑·커머스 급상승 |
| 토·일 | 특집 없음 |

필수: hot, signal, trend, news, desk, search, sources (+ 평일 special). voc·sns·board는 선택.
특집 제목·부제는 데이터의 `title`/`sub`가 우선이며 헤더 칩에 그대로 표시된다.

## 데이터 형식

```json
{
  "meta": { "date": "2026-10-09", "dateText": "2026년 10월 9일 (금)", "coverage": "커뮤니티 10/8 08시 → 10/9 08시 수집", "issueId": "community-2026-10-09" },
  "brief": [ { "text": "핵심 한 줄 (40~60자)", "meta": "근거 수치 · 출처" } ],
  "top":  { "kicker": "TOP STORY · 주제", "title": "", "paras": ["<b>강조</b>와 <a href=\"…\">링크</a>만 허용"], "links": [ { "text": "", "url": "" } ] },
  "side": { "kicker": "", "title": "", "paras": [], "links": [] },
  "sections": [ { "id": "hot", "title": "오늘의 화제", "sub": "TOP 6", "blocks": [ … ], "subsections": [ { "title": "", "blocks": [] } ] } ],
  "footer": ""
}
```

블록 `type`:
- `text {html}` · `caption {html}` · `subhead {text}` · `note {html}`
- `articles {items:[{title, src, paras[]}]}`: 화제·특집·뉴스 기사
- `watch {items:[{tag, html}]}`: tag에 포착/확산/정착/소멸이 들어가면 색이 자동으로 정해진다
- `bars {title, rows:[{label, value, pct 0~100, neg}], caption}`
- `lifecycle {cols:[{stage:'조짐|확산|정착|소멸', items[]}]}`
- `table {caption, head[], rows[][], rankCol}`
- `kpis {items:[{label, value, sub}]}`: 3열 지표
- `desk {items:[{role, title, paras[]}]}`: 기획자용 / 큐레이터용 / 마케터용
- `cards {items:[{label, title, paras[]}]}`
- `chart {title, svg, legend:[{color,text}], blocks[]}`: SVG는 문자열로 넣는다
- `grid {cols:[[blocks],[blocks]]}` (2열) · `stack {cols:[…]}` (세로)
- `sources {html}`

## 작성 규칙 (생성 에이전트용)

- **brief 3줄**: ① TOP STORY 요지 ② 화력 1위 이슈 ③ SKB VoC 부정·문의 건수와 전일 대비(“경보 없음” 같은 문구는 쓰지 않는다. VoC가 없는 날은 시그널 신규 항목). 한 줄은 60자 이내이고, `meta`에 근거 수치를 단다.
- 본문 HTML 태그는 `<b>`, `<a href>`, `<br>`만 허용한다. 스타일과 클래스는 넣지 않는다.
- 시사·정치 항목은 화제 TOP 6에서 1건까지만 넣는다.
- 본문을 확인하지 못한 내용은 문장에 "(본문 미확인)"이라고 표기한다.
- 발행 전 `validate(data).issues`가 비어 있어야 한다.

## 기존 리포트 변환

현재 파이프라인이 만드는 클래스 기반 HTML(`.headline-block`, `.section-title`, `.cols` …)도 변환할 수 있다. 같은 규칙으로 JSON을 뽑을 수 있고, `data/` 안의 7일치 파일이 그 결과다.
