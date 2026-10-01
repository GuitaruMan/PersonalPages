# 아이 학습 페이지 별 기록 서버 저장 + 지현이 파닉스 페이지 설계 (2026-09-30)

## 1. 목적
- iPad 사파리가 기기 저장소(localStorage)를 지워 별이 사라지는 문제를 없앤다 → 기록을 Cloudflare 서버(D1)에도 저장한다.
- 지현이(유치원)용 영어 파닉스 게임 페이지를 만든다. 디자인은 주현이 미션북과 같고 색만 다르다.

## 2. 저장 구조
- 페이지는 GitHub Pages 그대로. 저장 서버만 Cloudflare Worker `kids-progress` + D1 `kids-progress`.
- 로그인 없음. 페이지마다 고정 이름표(key)로 저장한다.
  - 주현이 미션북: `juhyun-mission-u78`
  - 지현이 파닉스: `jihyun-phonics`
  - 새 아이/새 페이지는 새 이름표만 쓰면 된다(서버 수정 불필요, 형식 `^[a-z0-9-]{3,40}$`).
- 저장 데이터: `{ epoch, stars:{활동:별}, best:{id:초}, notes:{키:글}, nt:{키:수정시각} }`. 효과음 켜기/끄기는 기기별이라 서버에 안 보낸다.
- API (요청 출처는 `https://guitaruman.github.io`, 로컬 테스트 주소만 허용, 본문 32KB 이하)
  - `POST /sync/:key` 본문=기기 기록 → 서버가 합쳐 저장하고 합친 결과를 돌려준다.
  - `POST /reset/:key` → 새 epoch로 빈 기록을 만들고 돌려준다.
  - `GET /p/:key` → 기록을 읽기만 한다(없으면 null). 목록 페이지가 타일 아래에 별 개수를 보여 줄 때 쓴다. 게임 페이지가 `notes._sum`에 "딴 별/전체 별"을 적어 둔다.
- 합치는 규칙(별이 절대 줄지 않게): 별=큰 값, 최고 기록=작은 값, 메모=수정 시각이 늦은 것.
- 초기화: epoch가 서버와 다른 기기 기록은 버리고 서버 것을 따른다(초기화가 이긴다).
- 기기 쪽(`home/progress.js`)
  1. 열 때 기기 기록을 읽고 곧바로 `/sync` → 결과로 화면을 다시 그린다.
  2. 별을 얻으면 기기에 즉시 저장 + 0.8초 뒤 `/sync`.
  3. 실패하면 "저장 대기" 표시 후 5·15·30·60초 간격 재시도, 인터넷 복구·화면 복귀 때도 재시도.
  4. 상태 표시: ☁️ 저장됨 / ⏳ 저장 중 / ⚠️ 인터넷 연결을 확인해요.
- 초기화 버튼: 두 번 누르기 + 확인창("서버 기록까지 모두 지워져요").

## 3. 지현이 파닉스 페이지
- 위치: `home/지현이/영어_파닉스.html`, 녹음 `home/지현이/영어_파닉스/audio/*.mp3`, `지현이.html`에 링크.
- 발음: Wikimedia Commons `En-us-<단어>.ogg`(미국식 사람 녹음)의 mp3 변환본. 출처·라이선스는 페이지 하단에 표기.
- 파닉스 낱소리 녹음은 쓰지 않는다. 대신 글자마다 한글 힌트:
  - B ㅂ C ㅋ D ㄷ F ㅍ G ㄱ H ㅎ J ㅈ K ㅋ L ㄹ M ㅁ N ㄴ P ㅍ Q ㅋ R ㄹ S ㅅ T ㅌ V ㅂ W ㅇ X ㅋㅅ Y ㅇ Z ㅈ TH ㅆ
  - 모음(짧은 소리) A 애 E 에 I 이 O 아 U 어
- STAGE 1 알파벳 파닉스 (Letter Land) — 대표 단어 A~Z + TH
  apple ball cat dog egg fish goat hat insect juice kite lion moon nest octopus pig queen rabbit sun tiger umbrella van web fox(x) yo-yo zebra thumb
  1. 글자 카드(학습) 2. 첫소리 찾기 3. 짝 맞추기(카드 뒤집기) 4. 풍선 터뜨리기
- STAGE 2 단어 (Word Builder) — 규칙대로 읽히는 CVC 30개
  - a: cat bat hat bag map pan / e: bed pen hen net leg ten / i: pig pin lip kid six zip
  - o: dog box pot fox log ox / u: sun bus cup bug nut hut
  1. 단어 카드(학습) 2. 듣고 그림 고르기 3. 글자 조립 4. 빈칸 채우기
- 별: 게임은 실수 수로 1~3개, 학습은 3개(주현이 미션북과 같은 규칙).

## 4. 검증
- Worker: `wrangler dev`(로컬 D1)로 sync/합치기/초기화/잘못된 key·출처 거부를 확인.
- 페이지: Playwright로 각 게임 끝까지 진행, 새로고침·기기 저장소 삭제 후에도 별이 서버에서 돌아오는지 확인.
- 배포(Cloudflare, git push)는 사용자 확인 후.

## 5. 배포 기록 (2026-09-30)
- Worker: https://kids-progress.guitaruman-stock.workers.dev · D1 `kids-progress` (71f1737a-4263-4947-bb7f-69706ed9f685)
- 배포: 이 폴더에서 `npx wrangler deploy`.
- 학교 PC 네트워크에서는 `d1 execute --file`(파일 업로드)이 인증서 문제로 실패한다 → `--command "SQL"`로 보낸다.
