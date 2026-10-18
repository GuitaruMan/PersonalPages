# 공통국어2 수행평가1 채점 — 인수인계 문서 (2026-10-19)

이 문서는 2026-10-18~19 세션에서 한 채점 작업의 전부를 담는다. 다른 컴퓨터에서 이어서 할 때 이 문서와 아래 "기준 문서", "메모리" 세 가지만 있으면 맥락이 복원된다.

---

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 대상 | 공통국어2 수행평가1 "두 작품 비교 감상문", 9개 반 189명 |
| 채점 사이트 | https://suhaeng1.guitaruman-stock.workers.dev/ (Cloudflare Worker `suhaeng1`, Cloudflare Access 구글 로그인 뒤) |
| 현재 배포 버전 | **c0411a9c-37cb-44c2-aa7c-d2ff7c1c18d5** (2026-10-19) — 189명 점수·근거·피드백 전부 반영, 배포본 문자열 대조 1,174건 일치 |
| 소스 폴더(이 PC) | `E:\ForClaude\Create\suhaeng-worker` (git 저장소 아님, 이 PC에만 있음) |
| 기준 문서 | `E:\ForClaude\Create\수행평가채점_공통국어2_채점기준_v2.md` (§7·§8에 교사 확정 규칙) |
| 기준 자료 정리본 | `E:\ForClaude\Create\수행평가채점_공통국어2_기준자료.md` (채점표, 작품 조합, 시 원문, 수업 풀이) |
| 결과 파일 | `suhaeng-worker\grading\results\1.json ~ 9.json` (점수·영역별 근거·피드백의 원본) |
| 클로드 메모리 | `C:\Users\안원진\.claude\projects\E--ForClaude\memory\project_gukeo2_suhaeng_grading.md` |
| 담당 교사 계정 | 1·2·3·7반 minjung1457, 4·5·6반 jyp8591, 8·9반 wonjinia(관리자) |

평균 총점 83.2 / 100. 영역별 분포(189명): 이해 20점 89·15점 88·10점 10·5점 2 / 비교 30점 46·23점 120·16점 23 / 해석 30점 93·23점 62·16점 25·9점 9 / 구성 20점 111·15점 64·10점 13·5점 1.

---

## 2. 채점 기준 (요약)

네 영역, 단계 점수만 사용(중간 점수 없음).

| 영역 | 만점 | 단계 | 뜻 |
|---|---|---|---|
| 작품 이해·분석 | 20 | 20 / 15 / 10 / 5 | 20 = 화자·상황·정서·태도·표현을 두루 + 표현이 의미를 어떻게 만드는지(심층). 15 = 한 요소 빠지고 심층 없음. 10 = 한 작품이 거의 없거나 핵심 구절 오독. 5 = '있다' 수준 |
| 작품 비교·연결 | 30 | 30 / 23 / 16 / 9 | 30 = 공통점·차이점을 내용으로 구체적으로 비교하고 형식·표현의 차이를 정서·의미와 심층 연결. 23 = 비교적 구체적(적어도 한 항목이 두 화자의 마음·태도를 견줌). 16 = 이름 붙이기·유무 확인의 단순 비교. 9 = 비교라고 볼 여지만 |
| 해석·관점 | 30 | 30 / 23 / 16 / 9 | 30 = 공감한 부분을 지목하고 이유를 밝힘 **또는** 비교에서 나온 중심 해석을 깊이 전개. 23 = 자기 해석·판단이 분명하고 근거가 있음. 16 = 느낌·활동 소감 수준. 9 = 감상 문장이 없음 |
| 구성·표현 | 20 | 20 / 15 / 10 / 5 | 서/본/결 짜임 + 분량. 짜임 문제(서론·결론·문단 없음, 서론이 분석 문단에 붙음)는 겹쳐도 **한 단계(15)만**. 950자 미만 -5, 표기 오류 20개 초과·교사주 -5는 별도 추가. 5는 한두 문장 수준일 때만 |

교사의 단계 감각: 1단계=잘 씀, 2단계=그래도 괜찮음, 3단계=정말 못 씀, 4단계=그런 말이 '있다'.

### 교사가 확정한 세부 규칙 (기준 문서 v2 §7·§8 그대로)
1. **이해·분석의 틀린 서술**: 1개면 그 항목만 세지 않고 점수 유지. 치명적 틀린 서술 2개 이상(형식·갈래 오류, 구절 주어·상황 오독, 시에 없는 내용)이면 한 단계 감점.
2. **해석 30점**: 공감 부분 지목 + 이유가 있으면 경험이 짧아도 30. **'경험이 없다'는 절대 감점 사유가 아니다**(경험은 감상의 재료). 23에 두는 까닭은 "공감의 근거가 약하다 / 구절 근거가 없다 / 두 작품을 함께 놓고 얻은 생각이 없다 / 느낌 서술에 그친다"로만 적는다.
3. **비교에서 나온 감상이어야 30**: 두 작품을 따로 평가하고 한 문장으로 묶은 것은 관점이 뚜렷해도 23 (9-5).
4. **비교·연결 감점 사유에 '구절 인용 없음'을 쓰지 않는다** (기준에 없는 요건).
5. **짜임 문제는 한 단계만**. 서론이 분석 문단에 붙어 있으면 15로 통일(2-5·2-6·2-11·3-10·3-12·3-14·6-5·7-17·8-7·8-15·8-17·9-5). 첫 문단이 두 작품 소개로만 되어 있으면 서론으로 인정.
6. 분량은 판독문 글자 수(page.html `charsOf`와 같음: ⟨⟩·U+200D 제거, 줄 끝 빈칸 제외). 950 미만 -5. **949자(1-14, 1-15)는 교사 지시로 감점 없음.**
7. 경어체 몇 군데, 고전 시가 인용의 중세국어 표기 오류는 감점하지 않음. 통신체('~임')만으로 감점한 학생 없음(7-3 유지 20).
8. **교사가 사이트에서 고친 점수는 유지**(9-4 해석 30, 9-11 이해 15, 7-13 구성 15, 7-20 구성 10, 7-17 구성 15). 교사가 피드백에 적은 사유는 fbtext에 그대로 포함(7-13·7-17 구성 줄, 7-20 구성 줄 — 이 세 줄은 스크립트가 건드리지 않음).
9. 비교 작품(목련 후기·이별 노래·선운사 동백꽃)은 수업 풀이가 없으므로 학생의 타당한 다른 해석을 인정. 가시리·묏버들·개여울은 수업 풀이 기준.
10. 이전 수행평가 기록(9/19 테스트 D1 edits, ForTest\*.json)은 절대 참고하지 않음.

### 학생용 피드백 쓰는 법 (교사 요구, 2026-10-19)
- 학생이 보는 것은 **fbtext(학생용 피드백)**뿐이다. 영역마다 한 줄 `◦ 영역명 점수/만점: 본문`.
- 본문은 **설득하는 글**: "네가 쓴 것 인정(줄 번호) → 이 점수의 기준 → 네 글이 어디서 멈췄는지 → 그래서 N점 → 다음에는 ~하면 된다". 2인칭("너/네 글"), 평어체, 느낌표·칭찬 남발 금지. 길이 제한 없음(현재 평균 160자, 최대 500자).
- 감점 영역의 detail ✕ 본문과 fbtext 본문은 같은 글이다. 만점 영역은 "감점 없음" (+ 점수가 올라간 경우 인정 사유 한 문단, ○ 항목으로도 넣음).
- 줄 번호는 사이트 판독문의 줄 번호.

---

## 3. 사이트·데이터 구조

- Worker 소스: `src/index.js`(API), `src/page.html`(화면), `src/data.js`(189명 데이터 `export const DATA`). 배포는 **반드시 `bash deploy.sh`** (tools/check.py 검증 → tools/guard.py 손실 검사 → wrangler deploy).
- 교사 수정은 D1 `suhaeng-edits`의 `edits` 테이블(append-only, field = score | transcript | feedback | name | check). 최신값 SQL은 index.js `/api/current`와 같음. 읽기: `npx wrangler d1 execute suhaeng-edits --remote --json --command "..."` (wonjinia 로그인 상태).
- 학생 레코드 필드: `n`(번호), `name`, `work`(작품 조합), `tx`(판독문), `sc`[4], `total`, `check`(선생님 판단 필요), `detail`(영역별 `{k:'o'|'x'|'※'|'i', t, r}` 목록), `fbtext`(학생용 4줄), `dpre`(분량 감점 전 구성 점수), `pages`/`GEO`(스캔 위치).
- 허용 단계값은 index.js LEVELS(20/15/10/5/0, 30/23/16/9/0). check.py가 fbtext의 "영역명 N/" 점수와 sc 동기화를 검사한다.
- 스캔 원본: R2 `suhaeng-scans/{반}/{쪽}.jpg`. 이미지 확인: `tools\판독`에서 `$env:CLS=반; python grid4.py block <쪽> <시작행> <끝행> 220`.
- 판독 지침: `tools/판독/README.md`, 전체본 `E:\ForClaude\PersonalPages\personal\기타\수행평가-판독\README.md`.

---

## 4. 채점 파이프라인 (suhaeng-worker 폴더에서)

```
# 1) 서버 현재본 받기 (Cloudflare API, 토큰은 wrangler default.toml — 출력하지 말 것)
#    _prev/script_now.bin → node _prev/ext.js → _prev/server_DATA.json
# 2) 교사 수정 최신값
npx wrangler d1 execute suhaeng-edits --remote --json --command "<index.js /api/current 의 SQL>" > _prev/d1_current.json
# 3) 채점 자료 만들기 (server_DATA + d1_current + overrides.json → corpus/{반}-{번호:02}.json)
node grading/build_corpus.js
node grading/dump_class.js 5          # grading/dump/5.txt (줄 번호 포함, 읽기용)
# 4) 채점 → grading/results/{반}.json 갱신
# 5) 기계 검사
node grading/consistency_check.js     # 단계값·fbtext 동기화·분량 표시·짜임 서술 vs 점수
#    (현재 남는 경고는 모두 가짜 양성: 1-15 949자 교사 면제, 1-21·7-21 ※ 줄 표시, 6-14 D=5, 9-5 교사주 -5)
# 6) data.js 생성 — 채점한 반을 전부 나열해야 함(안 적은 반은 되돌아감)
node grading/apply_results.js grading/results/{1,2,3,4,5,6,7,8,9}.json
node --check src/data.js
# 7) 배포
bash deploy.sh
# 8) 배포본 대조: API로 스크립트 받아 fbtext 4줄×189 + ✕ 본문이 전부 들어 있는지 python으로 문자열 대조
```

판독문이 바뀐 학생 찾기: `node grading/changed_since.js [기준점]` (1~5반은 `_backup/20261018_pregrade/d1_current.json`, 6~9반은 `_backup/20261018_after5/d1_current.json` 기준).

---

## 5. 이 세션(10-18 → 10-19)에 한 일, 순서대로

1. **1~9반 189명 1차 채점·배포** (버전 08a2c314).
2. **교사 규칙 반영 재조정** — 스크립트는 전부 `grading/`에 있음:
   - `regrade_20261018.js`: 판독문 바뀐 17명 재채점, 1-14 분량 감점 제거(교사 지시).
   - `regrade2_20261018.js`: 이해 '틀린 서술 2개 이상 → 한 단계' 6명 20→15, 해석 '공감 지점+이유 → 30' 39명 23→30.
   - `regrade3_20261018.js`: 구성 짜임 문제 한 단계만 — 11명 10→15, 4명 5→10.
   - `regrade4_20261018.js`: 7반 재판독 반영 + 교사 조정값 유지(7-13·7-17 교사 사유 포함, 7-20 구성 10).
   - `regrade5_20261018.js`: 비교 사유에서 '구절 인용 없음' 제거(26명).
3. **전 학생 재검토** (`grading/review/`): 의심 44건 → 형평성 기준으로 28건으로 줄여 바탕화면 엑셀 `수행평가1_채점검토_의심목록_20261018.xlsx`로 전달. 비교 사유 105건·이해/해석/구성 22건을 2인칭 상세 사유로 재작성(`rewriteB_{반}.json`, `rewriteACD_{반}.json`, 적용 `apply_review.js`). 배포 ddf05127.
4. **교사 엑셀 결정 반영 (10-19)**: 점수 변경 19건(`grading/review/score_changes_20261019.json`):
   1-4 이해 20→15 / 1-13 비교 16→23 / 1-14 해석 16→23 / 1-15 해석 16→23·구성 10→15 / 1-19 비교 23→30 / 2-1 해석 16→23 / 2-4 비교 30→23·해석 23→30 / 2-6 구성 20→15 / 2-11 비교 16→23 / 2-18 비교 23→30 / 3-10 구성 20→15 / 4-15 해석 23→30 / 5-2 해석 23→30 / 5-5 해석 16→23 / 7-2 해석 16→23 / 7-10 이해 5→10 / 8-7 구성 20→15.
   교사가 유지로 정한 것: 4-19 이해 20, 4-2 해석 23, 7-16 해석 23, 7-19 해석 23(사유를 '공감의 근거가 약함'으로), 8-1 비교 23, 8-17 구성 15, 9-1 해석 23(가시리 해석이 구절과 안 맞음), 9-5 해석 23(비교에서 나온 감상 아님), 9-17 해석 23(근거 약함). 2-10 이해 20 유지하고 틀린 서술 2개는 해석 23 사유에 포함.
5. **학생용 피드백 전면 상세화 (10-19)**: 감점 영역 414개의 본문을 설득형 장문으로 교체(`grading/review/fb2_{반}.json`, 적용 `apply_fb2.js`), '경험이 없어서'류 문구 전부 제거. 만점으로 오른 6개 영역은 ○ 항목+인정 사유. 교사 사유가 든 7-13·7-17·7-20 구성 줄은 그대로 둠. **배포 c0411a9c, 대조 1,174건 일치.**
6. 백업: `_backup/results_20261018_review/`(재검토 전), `_backup/results_20261019_before_fb2/`(10-19 반영 전), `_prev/deployed_c0411a9c.txt`(배포본).

---

## 6. 미결·다음 할 일

- **8-5 김성민(?)**: 연필이 흐려 판독문의 1/3 이상이 ⟨⟩·▯. 교사가 판독문을 다시 제공하기로 함 → 받으면 이해·해석 재채점(현재 [15,23,23,20]은 읽히는 부분 기준).
- 교사가 사이트에서 점수를 더 고치면 D1 edits(field='score')로 남는다. 그 사유를 물어 같은 기준을 전체에 적용하는 흐름(10-18에 두 번 함). 사이트 수정값이 data.js 값보다 우선해 표시되므로 results/data.js를 바꿀 때는 D1 edits와 충돌하지 않게 확인.
- 판독문이 더 바뀐 학생이 있으면 §4의 changed_since → 재채점 절차. **교사가 "하라"고 말할 때만** 시작(10-18 지시).
- 엑셀 의심 목록에서 '유지'로 끝난 학생은 다시 올리지 말 것(교사 결정 완료).

---

## 7. 다른 컴퓨터에서 이어서 하려면

1. 이 PC의 `E:\ForClaude\Create\suhaeng-worker` 폴더(소스·결과·백업 전부)와 `E:\ForClaude\Create\수행평가채점_공통국어2_*.md` 두 문서를 복사해 간다. (git 저장소가 아니다.)
2. 폴더가 없으면 서버 배포본이 곧 원본이다: Cloudflare API `GET /accounts/{id}/workers/scripts/suhaeng1`로 멀티파트 스크립트를 받아 `data.js` 부분(`export const DATA = {...};`)을 꺼내면 189명 전체(판독문·점수·근거·피드백)가 복원된다. wrangler 로그인(`npx wrangler login`, wonjinia)과 D1 읽기 권한이 필요하다.
3. 판독 이미지는 R2 `suhaeng-scans`에 있다. 로컬 PDF 경로는 `tools/판독/measured.json`·`grid.json`.
4. 클로드 메모리 파일(위 경로)과 기준 문서 v2 §7·§8을 먼저 읽히면 규칙이 복원된다. 채점 요청 시 "먼저 메모리 project_gukeo2_suhaeng_grading.md와 기준 문서 v2를 읽어라"고 지시할 것.

---

## 8. 파일 목록 (suhaeng-worker 기준)

| 경로 | 용도 |
|---|---|
| `src/data.js` | 배포되는 189명 데이터(apply_results.js가 생성) |
| `src/index.js`, `src/page.html` | Worker API·화면 (분량 950자, RUBRIC 문구는 기준 v2) |
| `deploy.sh`, `tools/check.py`, `tools/guard.py` | 배포 전 검증·손실 검사·배포 |
| `grading/results/{1..9}.json` | 채점 결과 원본 (sc, detail, check, fbtext, diff) |
| `grading/works.json` | 반-번호 → 작품 조합 |
| `grading/build_corpus.js`, `dump_class.js`, `apply_results.js`, `changed_since.js`, `consistency_check.js` | 파이프라인 |
| `grading/regrade{,2,3,4,5}_20261018.js` | 10-18 재조정 스크립트(이미 적용) |
| `grading/review/suspects_{반}.json`, `full_before_prune/` | 의심 목록(걸러낸 28건 / 원본 44건) |
| `grading/review/rewriteB_*.json`, `rewriteACD_*.json`, `apply_review.js` | 10-18 사유 재작성(적용됨) |
| `grading/review/fb2_{반}.json`, `score_changes_20261019.json`, `apply_fb2.js` | 10-19 점수 변경+피드백 상세화(적용됨) |
| `grading/review/build_excel.py`, `excel_notes.txt` | 바탕화면 엑셀 생성, 교사 메모 덤프 |
| `grading/review/xdump_{반}.txt`, `intro_check.txt` | 작업용 덤프(참고용) |
| `grading/dump/{반}.txt`, `grading/corpus/` | 판독문 덤프·채점 자료 |
| `_prev/server_DATA.json`, `_prev/d1_current.json`, `_prev/ext.js` | 서버본·교사 수정 최신값·추출기 |
| `_backup/` | 단계별 백업 |
| 바탕화면 `수행평가1_채점검토_의심목록_20261018.xlsx` | 교사가 결정을 적은 엑셀(9번째 열 '교사의 선택') |
