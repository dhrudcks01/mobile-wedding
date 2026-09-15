# MW-16 · /photos 사진·동영상 업로드

## Vercel에는 Google 설정 4개만 등록

| 이름 | 값 |
|---|---|
| GOOGLE_CLIENT_ID | OAuth 클라이언트 ID |
| GOOGLE_CLIENT_SECRET | 해당 클라이언트의 비밀값 |
| GOOGLE_REFRESH_TOKEN | 본인 계정으로 승인해 발급한 Refresh token |
| GOOGLE_DRIVE_FOLDER_ID | 같은 OAuth 앱으로 생성한 비공개 폴더 ID |

환경변수 예제는 upload.env.example. 실제 비밀값을 커밋하거나 NEXT_PUBLIC_ 접두사를 붙이지 않는다.
기존 UPLOAD_* 변수는 모두 사용하지 않으므로 Vercel에서 삭제해도 된다.
Google 설정이 모두 준비되면 코드의 접수 기간 동안 업로드가 열린다. 환경변수 등록 후 재배포한다.

## 접속 및 운영

- 하객 주소와 QR: https://ournewday.kr/photos (행사 키, 로그인, URL fragment 불필요).
- 링크를 아는 사람은 접수 기간 동안 업로드할 수 있다. Origin 검사는 봇/남용 방어를 대신하지 않는다.
- 사이트 주소는 기존 src/data/wedding.ts의 meta.url을 사용한다.
- 접수 여부/종료일은 src/lib/photos/upload-config.ts에서 변경한다. 기본: enabled=true, 2026-11-08 23:59:59 한국 시간까지.
- 로컬은 pnpm dev 후 /photos 접속. development 모드에서는 같은 로컬 주소에서 오는 요청을 허용한다.
- 기존 청첩장 페이지/전역 스타일은 변경하지 않는다. Next.js Node 런타임이 필요하다.

## 코드 읽는 순서

1. src/app/photos/page.tsx: 행사 안내와 제목
2. src/app/photos/UploadForm.tsx: 선택 → 업로드 → 결과 표시
3. src/lib/photos/upload-client.ts: 2MiB 분할 전송/재시도
4. src/app/api/photos/session/route.ts, chunk/route.ts: 요청 처리
5. src/lib/photos/google-drive.ts: Google 토큰 갱신/파일 저장

스타일은 photos.module.css, 크기/확장자는 upload-rules.ts에서 변경한다.
upload-security.ts는 서버에서 Google 설정과 접수 상태/Origin을 확인하고 업로드 연결을 암호화한다.
암호화 키는 GOOGLE_CLIENT_SECRET에서 용도를 구분해 HMAC-SHA256으로 파생한다. 별도 환경변수나 브라우저에 노출되는 비밀값은 없다. Google 비밀값/클라이언트/폴더를 교체하면 진행 중인 세션은 새로 시작해야 한다.

## Google 연결 — 운영자 1회 설정

1. Google Cloud 프로젝트에서 Drive API를 활성화하고 OAuth 동의 화면과 Web application 클라이언트를 구성한다.
2. 본인 계정으로 `https://www.googleapis.com/auth/drive.file` 권한을 승인하고 offline access로 refresh token을 발급한다. 토큰과 클라이언트 비밀값은 서버 환경변수로만 관리하며 채팅/저장소에 넣지 않는다.
3. 같은 OAuth 클라이언트에서 받은 access token으로 Drive API `files.create`를 호출해 전용 폴더를 만든다. 요청 본문은 `{ "name": "결혼식 하객 사진", "mimeType": "application/vnd.google-apps.folder" }`. 반환된 `id`를 `GOOGLE_DRIVE_FOLDER_ID`에 넣는다. 폴더는 비공개로 유지한다.
4. `drive.file`은 앱이 생성하거나 사용자가 앱에 선택해 준 파일에 한정된다. Drive 웹에서 임의로 만든 기존 폴더 ID만 넣으면 접근에 실패할 수 있다. 이 초안에는 Picker나 운영자 로그인 화면이 없다.
5. 수동 발급 시 Google OAuth 2.0 Playground에서 **Use your own OAuth credentials**를 켜고 해당 클라이언트에 `https://developers.google.com/oauthplayground`를 redirect URI로 등록한다. 같은 클라이언트와 drive.file 범위로 승인·교환하고 폴더를 생성한다.
6. OAuth 앱이 External / Testing이면 이 권한의 refresh token은 7일 후 만료될 수 있다. 행사 전에 게시 상태, 계정 정책, 필요한 검증 여부를 확인하고 행사 기간 전체에 유효한 연결을 준비한다. 재연결은 환경변수 교체로 수행한다.


## 전송 제한

- 파일당 500MiB, 한 번에 30개. 사진/영상 원본 저장.
- JPG/JPEG, PNG, HEIC/HEIF, WEBP, MP4, MOV, M4V 지원. 내용 검사/악성코드 검사나 재인코딩은 미구현.
- 같은 열린 화면에서 세션을 보관해 실패한 전송을 재시도한다. 브라우저 종료/새로고침 후 자동 복구는 지원하지 않는다.
- 실제 Drive 파일 ID/크기가 확인돼야 완료로 표시한다. 페이지를 다시 열어 같은 파일을 보내면 중복될 수 있다.
- 서버 중계에 따른 호스팅 전송 비용/실행 제한은 Drive 저장 공간과 별개다. 공개 운영 시 호스팅의 요청 제한 설정과 동시 업로드를 점검한다.
- 실제 Google 계정 연결은 자격증명 설정 후 검증해야 한다. 단위 테스트에서는 Google 응답을 대체한다.

## 검증 명령

```sh
pnpm lint
pnpm build
node --test tests/uploads.test.cjs
```

## 하객 이름별 폴더

- 지정한 최상위 폴더 바로 아래에서 동일한 이름의 폴더를 검색하고 재사용한다. 없으면 생성한다.
- 이름은 앞뒤/연속 공백을 정리하며 빈 이름은 익명 폴더로 저장한다. 동명이인은 같은 폴더를 사용하므로 구분이 필요하면 이름에 식별 문구를 함께 입력한다.
- 휴지통의 폴더와 다른 부모 아래의 폴더는 사용하지 않는다. 검색 오류 시 루트에 대신 저장하지 않는다.
- 같은 서버의 동시 생성은 공유 Promise로 중복을 방지한다. Drive는 폴더 이름의 유일성을 보장하지 않으므로 서로 다른 Vercel 인스턴스에서 최초 업로드가 동시에 발생하면 동명 폴더가 생성될 수 있다. DB/분산 잠금은 추가하지 않았다.
- 기존 루트 파일은 자동 이동하지 않는다. 기존 파일의 설명(description)에 입력했던 하객 이름이 남아 있다.
