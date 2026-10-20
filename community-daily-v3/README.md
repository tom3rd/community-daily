# 커뮤니티 & 미디어플랫폼 리포트 — 2a 템플릿

매일 08:00(KST) 예약 작업이 이 저장소를 내려받아 리포트를 만든다. 에이전트는 **HTML을 직접 쓰지 않고** `data/YYYY-MM-DD.json` 하나만 만든다. 디자인은 `templates/render-2a.js`가 전담한다.

```
수집·선정(예약 프롬프트) → data/YYYY-MM-DD.json → build.mjs → out/ 의 report·email 두 파일
```

- 채택 디자인: 2a (보라 마스트헤드 #3617CE, 흰색 B 로고)
- 폰트: SKT Sans는 공개 호스팅하지 않는다. 글꼴 순서는 `SKT Sans Text → Pretendard Variable → sans-serif`이고, Pretendard는 jsDelivr에서 불러온다. SKT Sans가 설치된 PC에서는 SKT Sans로 보인다.
- 로고: `https://www.tom3rd.com/daily/assets/b-logo-white.png` (tom3rd-site Worker의 `public/daily/assets/`)

## 1. 실행 순서 (예약 작업용)

```bash
# 1) 저장소 받기 — 먼저 mcp__claude-code-remote__add_repo(owner "tom3rd", repo "community-daily", access "read")
git clone --depth 1 https://github.com/tom3rd/community-daily /home/claude/community-daily
cd /home/claude/community-daily && mkdir -p data out

# 2) data/YYYY-MM-DD.json 작성 (아래 2~4절 규칙)

# 3) 1차 빌드 → 점검
node templates/build.mjs data/YYYY-MM-DD.json --asset-base https://www.tom3rd.com/daily/ --out out
#    "점검 실패"가 나오면 JSON을 보완한다. 보완할 수 없는 섹션은 note 블록에 사유를 적는다.
#    완료 메시지의 "산점도 툴팁 N개"가 조회 100만·좋아요 1만 이상 영상 수와 같아야 한다.

# 4) out/community_daily_report_YYYY-MM-DD.html 을 Send에 게시 → 리포트 URL 확보

# 5) 2차 빌드 (메일에 리포트 URL 넣기). report 파일은 1차와 똑같이 다시 만들어진다.
node templates/build.mjs data/YYYY-MM-DD.json --asset-base https://www.tom3rd.com/daily/ --report-url https://www.send.co/a/XXXXXXXX --out out

# 6) out/community_daily_email_YYYY-MM-DD.html 을 Resend html로 발송
```

- report 파일은 반복 스타일을 클래스로 묶어 약 11~13만 자다(2026-10-21 v3 레이아웃부터)(화면은 묶기 전과 픽셀 단위로 동일). Send·Drive에 그대로 넘긴다.
- 파일 내용을 도구 인자로 넘길 때는 파일을 다시 읽어 그대로 쓴다. 손으로 다시 타이핑하거나 요약하지 않는다.

## 2. 요일 플랜과 섹션

공통 순서(렌더러가 고정, 2026-10-21 v3): 오늘의 핵심 3줄(+숫자 카드) → TOP·SIDE → `signal` → `hot` → `trend`+`sns`(한 섹션 "화력 & SNS 교차검증"으로 합쳐 그림) → `special`(평일) → `news` → `desk` → `search` → `voc` → `sources` → `board`

| 요일 | special (`title` / `sub`) |
|---|---|
| 월 | 미디어산업 위클리 — `subsections` 6개, 제목에 다음 말이 들어가야 점검 통과: 플랫폼별 시청률·순위 / 금주의 신작 / 다음 주 예정작 / 6개월 이슈 캘린더 / 사업자 동향 / 신규·부가서비스 |
| 화 | `화요일 SNS TRENDS` / `유튜브·틱톡·인스타그램` |
| 수 | `수요일 맛집·음식 급상승` |
| 목 | `목요일 팝업스토어·핫플레이스` |
| 금 | `금요일 쇼핑·커머스 급상승` |
| 토·일 | special 없음 |

필수: hot, signal, trend, news, desk, search, sources (+ 평일 special). `board` 섹션은 항상 `{ "id": "board", "title": "익명 게시판", "blocks": [] }`로 넣는다(게시판은 렌더러가 그린다).

## 3. JSON 형식

```json
{
  "meta": { "date": "2026-10-14", "dateText": "2026년 10월 14일 (수)", "coverage": "커버 10/13 08:38 → 10/14 08:40 (KST) · 커뮤니티 12곳·SNS·뉴스 요약 · 수요일 특집 수록", "issueId": "community-2026-10-14" },
  "brief": [ { "text": "60자 이내 한 줄", "meta": "근거 수치 · 섹션명" } ],
  "email": { "topSummary": "120자 이내", "sideSummary": "120자 이내", "specialSummary": "120자 이내" },
  "top":  { "kicker": "TOP STORY · 주제", "title": "", "paras": [""], "links": [ { "text": "커뮤니티: 짧은 제목", "url": "" } ] },
  "side": { "kicker": "주제", "title": "", "paras": [""], "links": [] },
  "sections": [ { "id": "hot", "title": "오늘의 화제 TOP 6", "sub": "", "blocks": [], "subsections": [ { "title": "", "sub": "", "blocks": [] } ] } ],
  "footer": "본 리포트는 커뮤니티 및 소셜 데이터를 자동 수집·요약한 것으로 원문 게시자의 의견과 무관하며, 특정 이슈에 대한 편집부 입장을 대변하지 않습니다. © 2026 THE COMMUNITY & PLATFORM DAILY · YYYY-MM-DD"
}
```

- 본문 HTML은 `<b>`, `<a href="…">`, `<br>`만 쓴다. style·class 금지. 링크의 `&`는 `&amp;`로 쓴다.
- `issueId`는 `community-YYYY-MM-DD` (익명 게시판 연동 키).

### 블록 타입

| type | 필드 | 용도 |
|---|---|---|
| `text` | html | 본문 문단 |
| `caption` | html | 출처·기준 시점·주석(작은 회색 글씨) |
| `subhead` | text | 섹션 안 소제목 |
| `note` | html | 연보라 박스 안내(수집 실패 사유 등) |
| `articles` | items[{title, src, paras[]}] | 화제·특집·뉴스 기사 |
| `watch` | items[{tag, html}] | 리틀 시그널·VoC 중립 글. tag에 포착/확산/정착/소멸이 들어가면 색이 정해진다 |
| `bars` | title, rows[{label, value, pct 0~100, neg}], caption | 막대 차트(화력·검색량·틱톡·인스타) |
| `lifecycle` | cols[{stage: 조짐/확산/정착/소멸, items[]}] | 라이프사이클 현황판 |
| `table` | caption, head[], rows[][], rankCol | 표 |
| `kpis` | items[{label, value, sub}] ×3 | 지표 3칸 |
| `desk` | items[{role, title, paras[]}] | 시사점 3박스 |
| `cards` | items[{label, title, paras[]}] | 카드(VoC 대표 글 등) |
| `chart` | title, svg, legend[], blocks[] | SVG 차트(산점도). svg는 문자열 그대로 |
| `grid` | cols[[blocks],[blocks]] | 2열 |
| `stack` | cols[[blocks],…] | 세로 묶음 |
| `sources` | html | 출처 링크 묶음 |

### 3-1. v3 레이아웃 필드 (2026-10-21부터, 모두 선택이지만 매일 채운다)

2026-10-20 사용자 피드백으로 확정한 레이아웃이다. 원칙: **결론과 숫자는 첫 화면에, 긴 근거는 접기(＋)로.** 기존 필드(`paras`, 블록들)는 그대로 쓰고, 아래 필드를 더한다. 없으면 렌더러가 기존 방식으로 대체하지만 그러면 글이 빽빽해지므로 반드시 채운다. 전체 예시는 `examples/2026-10-20.json`.

| 위치 | 필드 | 규칙 |
|---|---|---|
| 최상위 | `heroKpis` [{value, label, sub}] ×4 | 오늘의 핵심 아래 숫자 카드. ① 화력 1위 수치 ② TOP 핵심 숫자 ③ SIDE 핵심 숫자 ④ SKB 부정 건수 |
| `top`, `side` | `lead` [문단, 문단] | **정확히 2문단**, 합계 400~520자. 1문단 = 사실·숫자, 2문단 = 커뮤니티 반응(대표 댓글·수치·검색량). 기존 `paras`(3~4문단 원문)는 그대로 쓰고 "원문 전체 보기"로 접힌다 |
| `top`, `side` | `so` | "그래서" 한 문장(60~90자). IPTV·OTT 실무 시사점 |
| `top`, `side` | `fig` {title, rows[{label, value 숫자, hl, text?}], caption, bigs[{value, label, sub}]} | 본문 위 그래픽. rows는 비교 막대 3~4개(오늘 주인공 `hl:true`), bigs는 큰 숫자 2개. 기사·게시글에 실제로 있는 숫자만 쓴다 |
| `top` | `quote` {text, meta, more{text, meta}, video{id, title, meta}} | 대표 댓글 인용(좋아요 1위). `video`는 근거 영상이 유튜브일 때만(유튜브 영상 ID) |
| `hot` 각 item | `short` / `so` / `stat` | `short` 카드 제목(20자 안팎, ①·부제 없이), `so` 결론 한 줄(60자 안팎), `stat` 대표 숫자 1개(예: "화력 3,231 · 음원 997만"). 원래 `title`·`paras`는 접기 안에 그대로 |
| `sns` 섹션 | `signal` [{issue, yt, tt, ig, verdict}] | 플랫폼별 반응표. yt/tt/ig 값은 "강" / "약" / ""(미수집). 5행 안팎 |
| `special` 각 subsection | `videos` [{id, title, meta}] | 유튜브 썸네일 카드(최대 4개). **유튜브 영상만**, 미성년 출연자가 중심인 영상은 넣지 않는다. 뉴스 사진·커뮤니티 캡처 등 외부 이미지는 쓰지 않는다 |
| `desk` 각 item | `brief` | 첫 화면에 보이는 한 문장(50~70자). `paras` 전문은 접힌다 |
| `search` 섹션 | `down` [{kw, delta}] (선택) | "많이 내린 검색어" 칩. 없으면 끝 `caption`의 "하락 폭이 큰 검색어: A -x%, B -y%." 문장에서 자동 추출하므로 그 형식을 지킨다 |
| `voc` 섹션 | `glance` [3문장] | 맨 위 "한눈에 보기". 쉬운 말(불만·문의·칭찬)로 ① SKB 직접 언급 건수 구성 ② 경보 여부와 기준 ③ 사칭 의심 추이 |
| `voc` 대표 글 `cards` item | `summary` | 2~3줄 요약(90~130자). 기존 5~7문장 본문은 "자세한 요약"으로 접히고 "원문 보기" 링크는 본문 끝 `<a href>`에서 자동으로 꺼낸다 |
| `voc` `watch` item | `summary` | 한 줄 요약. 원문 링크는 자동 |

- **VoC 분량은 줄이지 않는다**(예약 프롬프트의 ⑪ 블록 순서 그대로). 요약 `text`는 전문 용어 대신 쉬운 말로 쓴다. 표(이슈 유형별·채널별·일별 이력)는 렌더러가 배지·강조로 자동 정리한다.
- **리틀 시그널은 줄이지 않는다.** `watch` 항목 본문은 지금 분량(3~4문장 + 원문 링크) 그대로. 위의 단계 흐름도(포착→확산→정착/소멸 개수)는 tag와 소멸 caption("소멸 판정 N건")에서 자동 계산한다.
- **요일 특집은 지금 분량 그대로**(하위 소제목 번호는 더 이상 표시하지 않는다).
- 화력 & SNS 섹션은 첫 화면에 화력 막대 6개 + `signal` 표만 보이고, 기존 `trend`·`sns` 블록(구글 트렌드·네이버 등락·라이프사이클·산점도·틱톡·인스타·교차검증 표)은 "수치 상세 보기"로 접힌다. 블록 작성 규칙은 그대로다.
- 뉴스는 제목 목록이 보이고 기사 요약은 접힌다. Top 20은 비고까지 2단으로 보인다(비고는 한 줄 30자 안팎으로 짧게).

## 4. 섹션별 작성 규칙

- **brief(정확히 3개)**: ① TOP STORY 요지 ② 화력 1위 이슈 ③ SKB VoC 부정·문의 건수와 전일 대비(“경보 없음” 같은 문구 금지; VoC 블록이 미갱신이면 신규 시그널). `text` 60자 이내, `meta`에 근거 수치와 섹션명.
- **email**: 세 요약 모두 120자 이내 1~2문장. 메일 상단 요약에 쓰인다.
- **top / side**: 정치·시사 금지(예약 프롬프트의 선정 원칙). `links`는 원문 딥링크 4~6개.
- **hot**: `articles` 1개에 6건. 제목 앞에 ①~⑥, `src`에 출처 커뮤니티(·로 구분). 시사·정치는 1건 이하, 그 제목에 “— 시사 화제 1건”. 끝에 `caption`(수집 시점·수집 한계).
- **signal**: `text`(고정 소개 문구) → `watch`(tag는 포착·신규 / 승격·확산 / 승격·정착 / 소멸; html은 `<b>이슈명</b> — 설명` + 원문 링크) → `text` 또는 `caption`(소멸·관찰 지속).
- **trend**: `grid`[화력 `bars`, 구글 트렌드 `bars`] → 네이버 등락 `bars`(하락은 `neg:true`) → `chart`{title:"라이프사이클 현황판", blocks:[`lifecycle`]}. pct는 최대값 기준 0~100.
- **sns**: `chart`(유튜브 산점도 svg) → `caption`(끝에 “조회 100만·좋아요 1만 이상인 오른쪽 위 N개 점은 마우스를 올리면 제목이 나온다.”) → `grid`[틱톡 `bars`, 인스타 `bars`] → 교차검증 `table` → 방법 `caption`.
  - 산점도 svg: viewBox 기준 점 r=2.6(일반)/3.6(강조), 축·라벨 폰트 7~7.5, 범례는 plot 영역 밖 상단. `</svg>` 바로 앞에 `<g fill="transparent" pointer-events="all">` 그룹을 두고 조회 100만·좋아요 1만 이상 영상마다 `<circle cx cy r="5"><title>제목 — 채널 · 조회 N만 · 좋아요 N만</title></circle>`. 제목의 `& < >`만 이스케이프. 그 외 `<title>` 요소는 svg에 넣지 않는다(빌드가 세는 툴팁 수가 틀어진다).
- **special**: 맨 위 `articles`(헤드라인 1건 + 리드 문단) → `subsections`(소제목별 `grid`/`bars`/`table`/`text`/`caption`) → 마지막 subsection 끝에 `sources`(블록 전용 SOURCES).
  - 월요일 깊이 기준(예약 프롬프트의 월요일 지침)은 그대로다. “인라인 SVG 차트”는 `bars` 또는 `chart` 블록으로, “.box3 3박스”는 `desk` 또는 `cards` 블록으로, “2단 컬럼 본문”은 `grid` 안의 `text`로 표현한다.
- **news**: `stack`[[`subhead` "■ 비즈니스 / 경제", `articles`], [`subhead` "■ 미디어 비즈니스", `articles`]].
- **desk**: `desk` 1개, role은 기획자용 / 큐레이터용 / 마케터용. title은 `<br>`로 끊어 정확히 2줄(줄당 14~17자).
- **search**: `caption`(실검 폐지 안내) → `table`{head:["순위","검색어","분류","등락률","비고"], rankCol:true, 20행} → `caption`(완결일·저지수 주의). 메일은 이 열 이름(검색어·분류·등락률)으로 Top 10을 읽는다.
- **voc** (`pilot: true`, title "SKB VoC 파일럿"): `caption`(파일럿·참고용 문구) → `text`(기준일·수집 범위) → `kpis`(SKB 긍정 / SKB 부정 / 통신사 불문) → `kpis`(SKB 중립·문의 / 사칭·환승사기 의심 / 경보) → `text`(요약 4~5문장) → `table`(이슈 유형별) → `subhead` "대표 부정 글" → `grid`[[`cards`],[`cards`]] → `subhead` "중립·문의 글" → `watch` → `subhead` "시사점" → `desk`(판매·CS용 / 모니터링용 / 마케터용) → `table`(채널별 수집 현황) → `table`(최근 4일 일별 이력) → `caption`(표본 한계 + 전체 문서 링크). 파일럿 문서가 오늘자로 갱신되지 않았으면 `note` 한 줄과 링크만.
- **sources**: `sources` 1개. `<b>소제목</b><br>` 다음 링크를 ` · `로 잇고 묶음 사이는 `<br><br>`.

## 5. 예시와 도구

- `examples/2026-10-12.json` (월요일, 위클리 6개 하위 섹션), `examples/2026-10-13.json` (화요일).
- `tools/convert_legacy_html.py`: 이전 클래스 기반 리포트 HTML을 JSON으로 변환(백필용). `python3 -I tools/convert_legacy_html.py old.html data/YYYY-MM-DD.json YYYY-MM-DD`
- `templates/README.original.md`: 디자인 패키지 원본 설명.

## 변경 이력
- 2026-10-21: v3 레이아웃 — 여백·섹션 아이콘·그래픽(비교 막대·큰 숫자·인용·유튜브 썸네일), 근거 접기, 시그널을 화제 앞으로, trend+sns 합본, Top 20 비고 노출, VoC 표 가독성 개선. 새 필드는 3-1절.
- 2026-10-13: 2a 템플릿 도입. 산점도 SVG 인라인화(툴팁 유지), 익명 게시판 ANONYMOUS 표시·회차 표시 추가, SKT Sans 웹폰트 → Pretendard 대체, 리포트 스타일 클래스 압축(15만→9만 자).

## 다른 Send 리포트 (Report Kit)

커뮤니티 데일리를 제외한 모든 Send 리포트는 같은 2a 디자인의 공용 킷 `templates/render-kit.js` + `templates/build-kit.mjs`로 만든다. 사용법은 `docs/KIT.md`.
