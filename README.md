# mobile-wedding

개인용 단일 모바일 청첩장입니다. Next.js App Router와 정적 TypeScript 데이터로 구성되며, 별도 백엔드나 데이터베이스 없이 Vercel 배포를 우선합니다.

## 현재 구현

- 약 3초간 표시되는 모바일 인트로와 웨딩 포스터
- 필름 릴 형태의 초대 문구와 스크롤 등장 효과
- 실시간 D-day 카운트다운과 월간 달력
- 신랑·신부 및 가족 정보
- 이미지 갤러리와 크게 보기 모달
- 화면 접근 시 지연 로딩되는 카카오 지도와 외부 지도 앱 링크
- 전화·문자 연락하기
- 신랑측·신부측 계좌번호 보기와 복사 피드백
- 링크 복사, Web Share API, 카카오톡 공유
- 엔딩 필름과 웨딩 크레딧
- `wedding.ts` 기반 Open Graph 및 Twitter metadata
- 360px~430px 우선 모바일 레이아웃과 데스크톱 중앙 정렬

현재 `CalendarButton`과 `.ics` 생성 로직은 준비되어 있지만 `DateSection`에서 버튼이 주석 처리되어 있어 실제 화면에는 노출되지 않습니다.

## 기술 스택과 범위

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 3
- 정적 데이터: `src/data/wedding.ts`
- 이미지: `public/images`
- 패키지 매니저: pnpm 9

다음 기능은 프로젝트 범위에 포함하지 않습니다.

- Spring Boot 또는 별도 API 서버
- MySQL, PostgreSQL, Prisma, ORM 등의 데이터 저장 계층
- 관리자 페이지, 로그인, 회원가입
- 여러 커플 관리
- RSVP 또는 방명록 저장

## 페이지 구성

`src/app/page.tsx`는 아래 섹션을 순서대로 조립합니다.

1. `IntroScreen`
2. `PosterSection`
3. `GreetingSection`
4. `DateSection`
5. `CoupleSection`
6. `GallerySection`
7. `LocationSection`
8. `ContactSection`
9. `AccountSection`
10. `ShareSection` — 엔딩 필름과 크레딧 포함

`ScrollRevealController`가 각 섹션의 `data-reveal` 요소를 화면 진입 시 표시합니다.

## 프로젝트 구조

```txt
mobile-wedding/
  public/images/                  # 청첩장 및 장식 이미지
  src/
    app/
      globals.css                 # 전역 스타일과 애니메이션
      layout.tsx                  # 폰트, OG/Twitter metadata
      page.tsx                    # 섹션 조립과 환경변수 연결
    components/
      common/                     # Button, CopyButton, Toast, 이미지 fallback 등
      invitation/                 # 청첩장 섹션과 KakaoMap
    data/wedding.ts               # 실제 청첩장 데이터 진입점
    lib/                          # 날짜, 캘린더, 지도 링크, 공유 헬퍼
    types/wedding.ts              # 데이터 타입
  docs/                           # PRD, 티켓, QA 및 작업 문서
  .agents/skills/                 # 프로젝트 전용 Codex 구현·리뷰 skill
```

상세 기준은 다음 문서를 참고합니다.

- `AGENTS.md`: 프로젝트 작업 규칙
- `docs/PRD.md`: 제품 범위
- `docs/PROJECT_STRUCTURE.md`: 폴더 역할
- `docs/TICKETS.md`: MW 티켓 백로그
- `docs/QA_CHECKLIST.md`: 배포 전 QA 항목
- `docs/MW15_MOBILE_QA.md`: 실기기 QA 절차

## 로컬 실행

```bash
pnpm install
pnpm dev
```

기본 개발 주소는 `http://localhost:3000`입니다.

변경 후에는 아래 명령을 실행합니다.

```bash
pnpm lint
pnpm build
```

## 환경변수

카카오톡 공유와 카카오 지도는 서로 다른 앱의 JavaScript 키를 사용할 수 있도록 분리되어 있습니다.

| 이름 | 필수 여부 | 사용 위치 | 설명 |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | 선택 | `ShareSection` | 카카오톡 공유 SDK 초기화용 JavaScript 키입니다. 없으면 카카오톡 공유 버튼을 표시하지 않습니다. |
| `NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY` | 선택 | `LocationSection` | 카카오 지도 SDK와 주소 검색용 JavaScript 키입니다. 없거나 지도 로딩에 실패하면 `mapLinks.kakao` 외부 링크를 fallback으로 표시합니다. |

로컬에서는 `.env.local`에 값을 설정합니다.

```dotenv
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=카카오톡_공유용_JavaScript_키
NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY=카카오맵_무료쿼터_앱의_JavaScript_키
```

`.env.local` 등 실제 환경변수 파일은 Git에서 제외되어 있으므로 키를 소스나 README에 직접 입력하지 않습니다. `NEXT_PUBLIC_` JavaScript 키는 브라우저에 전달되는 공개 플랫폼 키이므로 카카오디벨로퍼스에서 허용 도메인을 반드시 제한하고, REST API 키나 어드민 키를 대신 넣지 않습니다.

### 카카오 앱 설정

#### 카카오 지도용 앱

1. 카카오맵 무료 쿼터가 적용된 앱에서 카카오맵 API가 활성화되어 있는지 확인합니다.
2. 해당 앱의 JavaScript 키 설정에 로컬 및 배포 도메인을 `JavaScript SDK 도메인`으로 등록합니다.
3. 그 JavaScript 키를 `NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY`에 설정합니다.
4. 지도 호출량은 이 키가 속한 카카오 앱의 쿼터에 합산됩니다.

#### 카카오톡 공유용 앱

1. 공유용 앱의 JavaScript 키 설정에 로컬 및 배포 도메인을 `JavaScript SDK 도메인`으로 등록합니다.
2. 공유 메시지의 청첩장 링크가 열리도록 같은 배포 도메인을 `제품 링크 관리 > 웹 도메인`에도 등록합니다.
3. 그 JavaScript 키를 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`에 설정합니다.

두 기능을 같은 카카오 앱에서 운영할 경우 두 환경변수에 같은 JavaScript 키를 넣어도 됩니다. 서로 다른 앱으로 운영할 경우 각 앱에 청첩장 도메인이 정확히 등록되어 있어야 합니다.

## 청첩장 데이터 변경

모든 단순 청첩장 데이터는 `src/data/wedding.ts`에서 관리합니다.

| 필드 | 용도 |
| --- | --- |
| `meta` | 페이지 제목, 설명, 배포 URL, OG 이미지 |
| `intro` | 인트로 영문 이름과 안내 문구 |
| `couple` | 신랑·신부 이름, 부모님 성함, 전화번호 |
| `event` | 예식 일시, 장소, 주소, 주차 및 교통 안내 |
| `greeting` | 초대 문구 |
| `images.hero` | 포스터·필름 릴 등에 사용하는 대표 이미지 fallback |
| `images.poster` | 웨딩 포스터 이미지 |
| `images.film` | 초대 문구 위·아래 필름 릴 이미지 |
| `images.ending` | ShareSection 상단 엔딩 필름 이미지 |
| `images.gallery` | 갤러리 이미지와 다른 이미지 그룹의 fallback |
| `mapLinks` | 카카오맵, 네이버지도, 티맵, 구글맵 외부 링크 |
| `accounts` | 신랑측·신부측 계좌 정보 |

### 권장 변경 순서

1. `meta.title`, `meta.description`, `meta.url`, `meta.ogImage`를 실제 배포 정보로 변경합니다.
2. `intro`, `couple`, `event`, `greeting`을 실제 정보로 변경합니다.
3. 사용할 사진을 `public/images`에 넣고 `images` 경로를 연결합니다.
4. `mapLinks`에 사용할 외부 지도 URL을 입력합니다.
5. 필요한 경우에만 전화번호와 계좌 정보를 입력합니다.
6. `pnpm lint`, `pnpm build` 후 배포 URL에서 모바일 QA를 진행합니다.

`event.dateTime`은 타임존이 포함된 ISO 8601 형식을 사용합니다.

```ts
dateTime: "2026-10-24T13:00:00+09:00"
```

## 빈 값과 fallback

- 전화번호가 비어 있으면 해당 전화·문자 버튼을 표시하지 않습니다.
- `images.gallery`가 비어 있으면 갤러리 섹션을 표시하지 않습니다.
- `images.film`이 비어 있으면 갤러리 또는 대표 이미지를 필름 릴에 사용합니다.
- `images.ending`이 비어 있으면 갤러리 이미지를 엔딩 필름에 사용합니다.
- `mapLinks`의 값이 비어 있으면 해당 외부 지도 버튼을 표시하지 않습니다.
- 지도 키나 주소가 없거나 SDK 로딩이 실패하면 임베디드 지도 대신 카카오맵 외부 링크를 안내합니다.
- `accounts`가 비어 있으면 계좌 섹션을 표시하지 않습니다.
- 필수 문구가 비어 있으면 각 섹션에서 입력 예정 문구를 표시하거나 섹션을 숨깁니다.

## 이미지 관리

파일명은 자유롭게 정할 수 있으며 `wedding.ts`의 경로와 일치해야 합니다.

```txt
public/images/
  hero.jpg
  og-image.jpg
  poster.jpg
  film-01.jpg
  ending-01.jpg
  gallery-01.jpg
```

- 인트로 화면은 현재 `meta.ogImage`를 우선 사용합니다.
- 포스터는 `images.poster`, 필름 릴은 `images.film`, 엔딩 필름은 `images.ending`, 갤러리는 `images.gallery`를 사용합니다.
- `bg-showbox.png`, `img-showing.png`, `calendar-hands-lineart.png`는 포스터와 달력의 장식 에셋입니다.
- 이미지 경로가 잘못되면 `ImageWithFallback`이 안내 화면을 표시합니다.
- Vercel에서는 `next/image`가 전송 이미지를 최적화하지만 원본 파일이 지나치게 크면 저장소와 배포 용량이 커집니다. 현재 `public/images`에는 수 MB 이상인 원본도 있으므로 배포 전 압축과 리사이즈를 권장합니다.
- 화면용 이미지는 사용 크기에 맞춰 WebP/AVIF 또는 적절한 품질의 JPEG로 변환하고, OG 이미지는 1200×630 비율을 권장합니다.

## 지도 동작

`KakaoMap`은 초기 페이지 로딩 시 바로 SDK를 요청하지 않습니다. 지도 영역이 화면에 가까워지면 `IntersectionObserver`를 통해 SDK와 `services` 라이브러리를 로딩하고, `event.address`를 좌표로 변환해 마커를 표시합니다.

지도가 보이지 않을 때는 다음을 확인합니다.

1. `NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY`가 배포 환경에 등록되었는지
2. 키가 JavaScript 키인지
3. 키가 속한 앱에서 카카오맵 API가 활성화되어 있는지
4. 접속 도메인이 해당 키의 `JavaScript SDK 도메인`에 등록되었는지
5. `event.address`가 주소 검색 가능한 형식인지
6. `mapLinks.kakao`에 fallback 링크가 있는지

## 공유와 OG 미리보기

- 링크 복사는 현재 브라우저 URL을 사용합니다.
- Web Share API 지원 브라우저에서는 기본 공유창을 엽니다.
- 카카오톡 공유는 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`로 JavaScript SDK를 초기화합니다.
- 공유 메시지의 `위치 보기`는 `mapLinks.kakao`가 있으면 해당 링크를, 없으면 청첩장 `#location` 주소를 사용합니다.
- 카카오톡 공유에 사용하는 이미지는 `meta.ogImage`를 절대 URL로 변환해 전달합니다.

배포 전 다음 항목을 확인합니다.

1. `meta.url`이 실제 운영 URL인지 확인합니다.
2. `meta.title`, `meta.description`, `meta.ogImage`가 원하는 값인지 확인합니다.
3. OG 이미지가 공개 URL에서 정상 응답하는지 확인합니다.
4. 카카오디벨로퍼스 공유용 앱에 배포 도메인이 등록되어 있는지 확인합니다.
5. 배포 URL을 카카오톡 대화방에 붙여 넣어 제목, 설명, 이미지를 확인합니다.
6. 이전 값이 보이면 플랫폼의 공유 캐시를 갱신한 후 다시 확인합니다.

## Vercel 배포

1. GitHub 저장소를 Vercel에 Import합니다.
2. Framework Preset은 `Next.js`를 선택합니다.
3. Install Command는 `pnpm install`, Build Command는 `pnpm build`를 사용합니다.
4. 필요한 두 카카오 환경변수를 Project Settings에 등록합니다.
5. 배포 도메인을 `wedding.ts`의 `meta.url`과 각 카카오 앱 설정에 등록합니다.
6. 환경변수를 추가하거나 변경한 뒤에는 다시 배포합니다.
7. 배포 URL에서 지도, 공유, OG 미리보기와 실기기 동작을 확인합니다.

Cloudflare Pages, GitHub Pages, S3 등의 완전 정적 호스팅을 사용하려면 `next.config.ts`의 `output: "export"` 설정과 `next/image` 동작을 별도로 검토해야 합니다. 현재 설정은 Vercel의 Next.js 런타임을 기준으로 합니다.

## 개인정보와 키 관리

- 전화번호, 부모님 성함, 예식 주소, 계좌번호는 공개 페이지와 클라이언트 번들에 포함될 수 있습니다.
- 실제 개인정보를 입력하기 전에 당사자 동의와 공개 범위를 확인합니다.
- `.env.local`과 Vercel 환경변수에 JavaScript 키를 저장하고 Git에는 커밋하지 않습니다.
- 카카오 어드민 키, REST API 키 또는 서버용 비밀값을 `NEXT_PUBLIC_` 환경변수에 넣지 않습니다.

## QA

배포 전 최소 확인 항목입니다.

- 360px, 390px, 430px 폭에서 가로 스크롤과 레이아웃 깨짐이 없는지
- 인트로 종료 후 본문 스크롤이 정상인지
- 갤러리 모달을 열고 닫을 수 있는지
- 카카오 지도와 외부 지도 링크가 동작하는지
- 전화·문자, 계좌 및 링크 복사가 동작하는지
- 기본 공유창과 카카오톡 공유가 동작하는지
- OG 제목, 설명, 이미지가 운영 URL에서 표시되는지
- iPhone Safari, Android Chrome, 카카오톡 인앱 브라우저에서 정상인지

전체 체크리스트는 `docs/QA_CHECKLIST.md`와 `docs/MW15_MOBILE_QA.md`를 사용합니다.
