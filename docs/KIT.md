# Report Kit (2a) — Send 리포트 공통 디자인

2026-10-15부터 **커뮤니티 & 미디어플랫폼 리포트를 제외한 모든 Send 발행 리포트**는 이 킷으로 HTML을 만든다.
커뮤니티 데일리(2a)와 같은 디자인 언어다: 보라 마스트헤드 `#3617CE`, SKT Sans(설치 PC) → Pretendard, IBM Plex Mono 라벨, 1080px 카드.
커뮤니티 데일리는 계속 `templates/render-2a.js` + `templates/build.mjs`를 쓴다(이 킷과 별개).

## 원칙

- **HTML·CSS를 손으로 쓰지 않는다.** 에이전트는 JSON 하나만 만들고 `templates/build-kit.mjs`로 빌드한다.
- **로고는 넣지 않는다**(`meta.logo` 생략). B 로고는 커뮤니티 데일리 전용이다.
- 익명 게시판은 `sections` 마지막에 `{ "id": "board", "title": "익명 게시판" }`만 넣는다. 마크업·스크립트·안내 문구는 킷이 그린다(API https://waiting-radar-board.joonho73.workers.dev, 닉네임 입력란 없음). `meta.issueId`가 게시판 issue 값이다. ADMIN_TOKEN은 어디에도 넣지 않는다.
- 본문 HTML 태그는 `<b>`, `<a href>`, `<br>`만. 스타일·클래스 금지.
- 이미지는 `picks`/`image` 블록의 URL로만 넣는다. 깨진 이미지는 자동으로 숨겨진다.

## 빌드

```
git clone --depth 1 https://github.com/tom3rd/community-daily /home/claude/community-daily
cd /home/claude/community-daily
node templates/build-kit.mjs report.json --asset-base https://www.tom3rd.com/daily/ --out out/report.html
```

"점검 실패"가 나오면 JSON을 고쳐 다시 빌드한다(`--force` 금지). 완료 메시지의 `게시판 1개`를 확인한다.
Send 게시는 `out/report.html` 파일 내용을 손대지 않고 그대로 `CreateSite`(새 회차) 또는 `EditSite fullHtml`(같은 URL 갱신)에 넣는다.

## JSON 형식

```json
{
  "meta": {
    "series": "Spend Pulse",              // 마스트헤드 큰 제목. 줄바꿈은 \n
    "kicker": "한 줄 태그라인",             // 선택
    "no": "ISSUE 02",                     // 좌상단. 생략 시 NO. YYYY-DDD
    "label": "WEEKLY",                    // 우상단 (WEEKLY / DAILY / PILOT …)
    "date": "2026-10-08",
    "dateText": "2026년 10월 8일 (목) 발행",
    "chip": "소비 온도 100.1 · ▼4.9",       // 선택: 흰 칩
    "coverage": "집계 주간 …",              // 선택: 마스트헤드 하단 회색 줄
    "issueId": "spend-pulse-2026-10-08",  // 익명 게시판 키 (필수)
    "title": "Spend Pulse · Issue 02",    // <title>
    "briefLabel": "이번 주 핵심"            // brief 라벨 (기본 '핵심 요약')
  },
  "intro": "선택: 마스트헤드 아래 소개 문단",
  "brief": [ { "text": "핵심 한 줄 (60자 이내)", "meta": "근거 수치" } ],
  "top":  { "kicker": "", "title": "", "paras": [], "links": [ { "text": "", "url": "" } ] },
  "side": { "kicker": "", "title": "", "paras": [], "links": [] },
  "sections": [ { "id": "x", "title": "", "sub": "", "pilot": false, "blocks": [], "subsections": [ { "title": "", "sub": "", "blocks": [] } ] } ],
  "footer": { "left": "SPEND PULSE · 매주 목요일 아침 발행", "right": "", "text": "", "links": [ { "text": "아카이브", "url": "" } ] }
}
```

(`//` 주석은 설명용이다. 실제 JSON에는 넣지 않는다.) `intro`·`brief`·`top`·`side`는 모두 선택이다. 섹션 번호는 자동으로 매겨진다.

## 블록 타입

| 타입 | 필드 | 쓰임 |
|---|---|---|
| text / caption / note | `html` | 본문 / 출처·기준 시점 / 연보라 박스 |
| subhead | `text` | 섹션 안 소제목 |
| articles | `items:[{title, src, paras[]}]` | 기사·화제 목록 |
| watch | `items:[{tag, html}]` | 태그+한 줄. tag에 조짐/포착/확산/정착/소멸/HOT/RISING/긍정/부정/중립이 들어가면 색 자동 |
| bars | `title, rows:[{label, value, pct, neg}], caption` | 가로 막대 |
| chart | `title, svg, legend:[{color,text}]` | 인라인 SVG(색은 속성으로 직접 지정) |
| table | `caption, head[], rows[][], rankCol` | 표 |
| kpis | `items:[{label, value, sub}]` | 3열 지표 |
| desk / cards | `items:[{role|label, title, paras[]}]` | 좌측 라벨+본문 / 카드 |
| grid / stack | `cols:[[blocks],[blocks]]` | 2단 / 세로 |
| picks | `hero, items:[{rank, name, place, why, proof, credit, img}]` | 사진 픽 목록. `hero:true`면 첫 항목을 큰 사진으로 |
| image | `src, caption, credit, ratio` | 단일 이미지 |
| bignum | `label, value, unit, delta, sub, status` | 대표 수치(▼/− 로 시작하는 delta는 파랑) |
| scale | `value, min, max, labels[]` | 식음↔데움 같은 눈금 막대 |
| timeline | `items:[{date, html}]` | 날짜별 항목 |
| links | `items:[{date, title, sub, url}]` | 링크 목록(아카이브 등) |
| details | `items:[{label, title, blocks[]|paras[], open}]` | 접는 카드(아이디어·원문 전문 등) |
| sources | `html` | 출처 목록 |

## 시리즈별 매핑

| 리포트 | series / label | issueId | 기존 구성 → 킷 |
|---|---|---|---|
| Waiting Radar | `Waiting Radar` / WEEKLY, no `ISSUE NN` | `NN` | intro(고정 문구) → 조사 지표 `kpis` → HOT `picks`(hero 1 + 4) → RISING `picks` → 방법 `desk` → board. 예시 `examples/kit/waiting-radar-04.json` |
| 주간 맛집 콘텐츠 브리핑 | `주간 맛집\n콘텐츠 브리핑` / WEEKLY | `brief-YYYY-MM-DD` | scope → `caption`/`note`, 타임라인 → `timeline`, 인스타 비교 → `bars`, 아이디어 3개 → `details`, 소스 → `links` |
| Spend Pulse | `Spend Pulse` / WEEKLY, no `ISSUE NN` | `spend-pulse-YYYY-MM-DD` | 게이지 → `bignum`+`scale`, 52주 추이 → `chart`, 하위지수 → `kpis`, 변화 → `bars`, SNS 표 → `table`, 워치 → `watch`, 방법 → `desk`. 예시 `examples/kit/spend-pulse-02.json` |
| 부동산 딥다이브 | `부동산 시그널\n딥다이브 리포트` / WEEKLY | `real-estate-YYYY-MM-DD` | 구역별 8개 항목 → 구역마다 `subsections`, 수치 → `kpis`/`table`, 신호 → `watch` |
| SKB VoC 파일럿 | `SKB VoC 파일럿` / PILOT | `skb-voc` | KPI → `kpis`, 이슈 유형 → `table`, 대표 글 → `cards`, 중립 → `watch`, 채널 현황·일별 이력 → `table`, 원문 전문 → `details` |
| 그 밖의 단발 리포트 | 주제명 / REPORT | `<slug>-YYYY-MM-DD` | 자유 구성 |
