# MW-16 · /photos 사진·동영상 업로드

## 먼저 읽을 내용

일반적인 Next.js 페이지 + API 함수 구조입니다. 새 라이브러리, DB, 별도 서버를 추가하지 않았습니다. 기존 청첩장의 `src/app/page.tsx`, `layout.tsx`, 전역 CSS, `components/invitation`, `data/wedding.ts`는 수정하지 않습니다.

```text
src/app/photos/
  page.tsx                 제목, 행사 정보, 검색/공유 설정
  UploadForm.tsx           파일 선택, 버튼, 전송 상태
  photos.module.css        이 화면만 사용하는 스타일
src/app/api/photos/
  session/route.ts         POST: 파일 검사 후 업로드 시작
  chunk/route.ts           PUT: 조각 전송 / POST: 전송 위치 확인
src/lib/photos/
  upload-rules.ts          허용 확장자, 파일 개수/크기
  upload-client.ts         브라우저의 분할 전송과 재시도
  google-drive.ts          Google 토큰 갱신과 Drive API 호출
  upload-security.ts      서버의 접근 검사, 연결 암호화, 본문 제한
```

읽는 순서: `page.tsx` → `UploadForm.tsx`의 `handleUpload` → `upload-client.ts` → API → `google-drive.ts`.

### 무엇을 고치려면 어디를 보나요?

| 수정할 내용 | 파일 |
|---|---|
| 첫 화면 문구 | `app/photos/page.tsx` |
| 버튼, 파일 목록, 상태 문구 | `app/photos/UploadForm.tsx` |
| 색상, 간격, 글꼴 크기 | `app/photos/photos.module.css` |
| 파일당 크기, 선택 개수, 허용 형식 | `lib/photos/upload-rules.ts` |
| 접수 종료, Drive 폴더 | 환경변수 (`upload.env.example` 참고) |

한 줄에 여러 처리를 넣거나 중첩 삼항식으로 상태를 표시하지 않고, 일반 함수와 if/for/try-catch를 사용합니다. 동영상은 500MiB까지 받으므로 분할 전송은 유지합니다. 파일 전체를 한 번의 formData 요청으로 받으면 호스팅 본문 제한과 느린 통신에 취약해집니다. 연결 암호화 등 어려운 코드는 `upload-security.ts`에 모아 화면 수정과 분리했습니다.

## 주소와 실행

- 운영 주소: `https://ournewday.kr/photos` (배포 전).
- 기존 청첩장: `https://ournewday.kr/`.
- 개발 실행: `pnpm dev`, 확인 주소: `http://localhost:3000/photos`.
- 서브도메인, DNS 추가, 미들웨어, Host 분기가 필요하지 않습니다.
- `upload.env.example` 값을 `.env.local` 또는 기존 호스팅 환경변수에 넣습니다.
- 운영은 `UPLOAD_ORIGIN=https://ournewday.kr`, 로컬은 `http://localhost:3000`. **이 값에는 `/photos`를 붙이지 않습니다.**
- QR 주소: `https://ournewday.kr/photos#key=<UPLOAD_EVENT_KEY>`.
- 행사 키는 URL fragment로 전달하고 접속 후 주소창에서 제거합니다. `/photos` 직접 접속 시 키가 없으면 QR 안내가 나옵니다.
- 기존 `/upload` 초안 주소는 제거했습니다. 아직 발행하지 않은 QR은 `/photos` 주소로 생성합니다.
- Next.js Node 서버 기능이 필요하므로 정적 export만으로는 Drive 업로드가 작동하지 않습니다.

현재는 Google 자격증명 미설정으로 접수가 닫혀 있습니다. 실제 연결/배포 완료를 의미하지 않습니다.


## Google 연결 — 운영자 1회 설정

1. Google Cloud 프로젝트에서 Drive API를 활성화하고 OAuth 동의 화면과 Web application 클라이언트를 구성한다.
2. 본인 계정으로 `https://www.googleapis.com/auth/drive.file` 권한을 승인하고 offline access로 refresh token을 발급한다. 토큰과 클라이언트 비밀값은 서버 환경변수로만 관리하며 채팅/저장소에 넣지 않는다.
3. 같은 OAuth 클라이언트에서 받은 access token으로 Drive API `files.create`를 호출해 전용 폴더를 만든다. 요청 본문은 `{ "name": "결혼식 하객 사진", "mimeType": "application/vnd.google-apps.folder" }`. 반환된 `id`를 `GOOGLE_DRIVE_FOLDER_ID`에 넣는다. 폴더는 비공개로 유지한다.
4. `drive.file`은 앱이 생성하거나 사용자가 앱에 선택해 준 파일에 한정된다. Drive 웹에서 임의로 만든 기존 폴더 ID만 넣으면 접근에 실패할 수 있다. 이 초안에는 Picker나 운영자 로그인 화면이 없다.
5. 수동 발급 시 Google OAuth 2.0 Playground에서 **Use your own OAuth credentials**를 켜고 해당 클라이언트에 `https://developers.google.com/oauthplayground`를 redirect URI로 등록한다. 같은 클라이언트와 drive.file 범위로 승인·교환하고 폴더를 생성한다.
6. OAuth 앱이 External / Testing이면 이 권한의 refresh token은 7일 후 만료될 수 있다. 행사 전에 게시 상태, 계정 정책, 필요한 검증 여부를 확인하고 행사 기간 전체에 유효한 연결을 준비한다. 재연결은 환경변수 교체로 수행한다.

`UPLOAD_EVENT_KEY`, `UPLOAD_SESSION_SECRET`는 서로 다른 충분히 긴 난수로 생성한다(최소 32자). `UPLOAD_CLOSES_AT`는 반드시 시간대가 포함된 종료 시각으로 설정한다. 모든 설정 후 `UPLOAD_ENABLED=true`로 접수한다. 기본값은 닫힘이며, 설정 누락/종료 시 접수를 거부한다.

## 전송 구조

1. 브라우저가 파일 메타데이터를 `/api/photos/session`으로 보낸다.
2. 서버가 형식/크기를 확인하고 Drive 파일 ID와 resumable session을 만든다.
3. Drive URL·파일 크기·타입·ID·만료 시각을 AES-GCM으로 암호화한 토큰을 반환한다. Google access/refresh token과 원본 Drive session URL은 브라우저에 공개하지 않는다.
4. 브라우저는 원본을 2MiB 조각으로 나눠 `/api/photos/chunk`로 순차 전송한다. 서버가 읽는 본문도 2MiB로 제한한다.
5. 실패 시 Drive 상태를 조회해 실제 수신 위치에서 최대 3회 자동 재시도한다. 이후 하객이 같은 화면에서 다시 시도할 수 있다.
6. Drive 파일 ID와 실제 크기가 확인돼야 완료로 표시한다. 최종 응답이 유실돼도 ID로 조회하므로 동일 세션에서 완료 파일을 중복 생성하지 않는다.

형식: JPG/JPEG, PNG, HEIC/HEIF, WEBP, MP4, MOV, M4V. 파일당 500MiB, 화면당 30개. 이름은 선택 입력이고 Drive 파일 설명에 저장된다. 서버 디스크나 별도 저장소에는 파일을 보관하지 않는다. 원본 포맷은 유지하며 HEIC 변환, 영상 재인코딩, Live Photo 페어 결합은 하지 않는다.

## 초안의 운영 제한과 배포 전 확인

- 이어 올리기는 같은 열린 화면에서 보관한 파일/세션에 한정한다. 새로고침·브라우저 종료·iOS 백그라운드에서 자동 복구하지 않는다. 세션 만료는 24시간이다. 만료 파일은 목록에서 제거 후 다시 선택한다.
- 애매한 최종 전송 실패는 먼저 같은 화면에서 재시도한다. 페이지를 새로 열어 같은 파일을 다시 보내면 중복 저장될 수 있다.
- 서버가 모든 바이트를 중계하므로 호스팅 전송량/실행 비용이 발생할 수 있다. Drive 여유 공간과 별개다. 배포 서비스의 요청 크기/시간 제한과 동시 업로드 용량을 확인한다.
- 확장자와 신고 MIME을 검증하지만 파일 내용 진위/악성코드 검사까지 제공하지 않는다. 이 페이지에서는 업로드 파일을 공개하거나 실행하지 않는다.
- Origin과 행사 키를 검사하지만 봇 방어/요청 속도 제한을 대신하지 않는다. 공개 운영 전 호스팅 WAF에서 session 생성 API의 요청 속도·동시 실행 제한을 설정한다. 다수 하객이 같은 와이파이를 사용할 수 있으므로 과도한 IP 제한은 피한다. 분산 rate limit은 이 초안에 미구현이다.
- 폴더의 공개 공유를 켜지 않는다. 수집 안내, 보관/삭제 기준과 행사 종료 시각을 운영자가 확정한다.
- 실제 Google 인증, Drive 저장, DNS, HTTPS, 실기기 브라우저는 자격증명과 배포 후 별도 검증이 필요하다. 목 테스트는 외부 연동 완료를 의미하지 않는다.

## 검증

```sh
pnpm lint
pnpm build
node --test tests/uploads.test.cjs
```

실기기: 360/390/430px, iPhone Safari HEIC/MOV, Android Chrome MP4, 카카오 인앱 브라우저, 500MiB 동영상, 네트워크 중단/재시도, 저장 공간 오류, 종료 시각 이후 차단을 확인한다. `/photos`의 업로드 화면과 `/`의 청첩장을 각각 확인한다.

참고: [Drive resumable uploads](https://developers.google.com/workspace/drive/api/guides/manage-uploads), [Drive 권한](https://developers.google.com/workspace/drive/api/guides/api-specific-auth), [OAuth token expiration](https://developers.google.com/identity/protocols/oauth2#expiration).


## /photos 변경 검증 결과

- Next.js 프로덕션 빌드 및 TypeScript 검사 통과.
- ESLint 오류 0, 기존 청첩장의 PhotoBoothSection 미사용 경고 1.
- 테스트 8/8 통과: 파일 검사, 접근 검사, 암호화, 본문 크기 제한, Drive 응답 유실, 새 API 경로의 브라우저 분할 전송.
- 기존 청첩장 `/`와 `/photos` 모두 HTTP 200. 이전 `/upload`는 404. 접수가 닫힌 API는 503.
- canonical 주소 `https://ournewday.kr/photos` 확인, 390px 브라우저 화면 확인.
- 기존 추적 중인 청첩장 소스, package.json, lockfile, next.config.ts 변경 없음.
- PC의 pnpm 실행기 사전 검사 문제 때문에 설치된 Next/ESLint 실행 파일을 직접 사용함. 새 패키지는 추가하지 않음.
- 실제 Google 계정 업로드는 자격증명 설정 후 검증 필요.
- 다음 작업: MW-17 Google 연결 및 실제 업로드/기존 사이트 배포 검증.
