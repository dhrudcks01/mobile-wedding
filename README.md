# mobile-wedding

개인용 단일 모바일 청첩장 프로젝트입니다.

## 프로젝트 방향

- Spring Boot 없음
- DB 없음
- 관리자 없음
- 회원가입 없음
- Next.js + React + TypeScript 단일 프로젝트
- 청첩장 데이터는 `src/data/wedding.ts`에서 관리
- 이미지는 `public/images`에서 관리
- 지도는 API 임베드보다 지도 앱 링크를 우선 구현
- 배포는 Vercel 1순위, 정적 export 배포 2순위

## 문서 위치

```txt
AGENTS.md                         # Codex가 작업 전에 읽을 프로젝트 지침
.agent/                           # 사용하지 않음
.agents/skills/                   # Codex repo-specific skills
  mobile-wedding-implementation/  # 구현용 skill
  mobile-wedding-review/          # 리뷰용 skill
docs/
  PRD.md                          # 제품 기획안
  PROJECT_STRUCTURE.md            # 최종 폴더 구조
  TICKETS.md                      # 티켓 백로그
  CODEX_WORKFLOW.md               # Codex 작업 방식
  CODEX_PROMPTS.md                # Codex에게 줄 질문/프롬프트 모음
  QA_CHECKLIST.md                 # QA 체크리스트
```

## 개발 착수 순서

1. 이 문서 세트를 새 레포지토리 `mobile-wedding` 루트에 복사한다.
2. `docs/CODEX_WORKFLOW.md`를 보고 Codex를 실행한다.
3. `docs/TICKETS.md`의 `MW-00`부터 티켓 단위로 작업한다.
4. 각 티켓마다 `pnpm lint`, `pnpm build`를 통과시킨다.
5. 완료된 티켓은 체크박스로 표시하고 커밋한다.

## 개발 명령

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 정적 검사
pnpm lint

# production build 확인
pnpm build
```

## 현재 구현 범위

- 모바일 단일 페이지 청첩장 UI
- Hero, Greeting, Couple, Date/Calendar, Location, Gallery, Contact, Account, Share 섹션
- 정적 데이터 기반 렌더링과 빈 값 fallback
- 링크 복사, Web Share API, 카카오톡 공유 fallback
- `wedding.ts` 기반 OG metadata

## 데이터와 이미지

- 청첩장 문구, 예식 정보, 지도 링크, 계좌번호는 `src/data/wedding.ts`에서 관리합니다.
- 실제 전화번호와 계좌번호는 공개 페이지에 노출되므로 커밋 전 공개 가능 여부를 확인해야 합니다.
- 이미지는 `public/images` 아래의 `hero.jpg`, `og-image.jpg`, `gallery-*.jpg` 경로를 사용합니다.
- 실제 이미지 파일이 없어도 빌드는 깨지지 않지만, 배포 전에는 이미지 파일 존재와 용량 압축을 확인해야 합니다.

## QA 기준

- 모바일 360px~430px 화면을 우선으로 확인합니다.
- 데스크톱에서는 중앙 모바일 폭 컨테이너로 표시되는지 확인합니다.
- 변경 후 `pnpm lint`와 `pnpm build`를 실행합니다.
- Spring Boot, DB, API 서버, Prisma/ORM, 관리자/로그인/회원가입 기능은 추가하지 않습니다.

## 배포 방법

### Vercel 배포

1. GitHub 저장소를 Vercel에 Import합니다.
2. Framework Preset은 `Next.js`로 둡니다.
3. Install Command는 `pnpm install`, Build Command는 `pnpm build`를 사용합니다.
4. 환경변수가 필요하면 Vercel Project Settings의 Environment Variables에 추가합니다.
5. 배포 후 발급된 도메인을 `src/data/wedding.ts`의 `meta.url`에 반영합니다.
6. 다시 배포한 뒤 카카오톡/문자 공유 미리보기를 확인합니다.

### 정적 배포 참고

- 현재 설정은 Vercel의 Next.js 배포를 우선합니다.
- Cloudflare Pages, GitHub Pages, S3 같은 정적 호스팅을 선택할 경우 `next.config.ts`에 `output: "export"` 전환을 검토해야 합니다.
- 정적 export 전환 후에는 `pnpm build`로 생성되는 정적 산출물을 배포 대상에 맞게 업로드합니다.

## 환경변수

| 이름 | 필수 여부 | 설명 |
| --- | --- | --- |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | 선택 | 카카오톡 공유 버튼 활성화용 JavaScript 키입니다. 값이 없으면 버튼은 비활성 안내 상태로 표시됩니다. |

- 실제 API 키는 코드에 직접 커밋하지 말고 배포 환경변수로만 설정합니다.
- 키가 없어도 `pnpm build`가 실패하지 않도록 fallback이 구현되어 있습니다.

## 실제 정보 입력 위치

`src/data/wedding.ts`에서 아래 값을 실제 정보로 교체합니다.

- `meta.title`, `meta.description`, `meta.url`, `meta.ogImage`: 공유/검색 미리보기 문구와 이미지
- `couple.groom`, `couple.bride`: 신랑/신부 이름, 부모님 성함, 연락처
- `event`: 예식 일시, 장소명, 홀명, 주소, 주차/교통 안내
- `greeting`: 초대 문구
- `images.hero`, `images.gallery`: 대표 이미지와 갤러리 이미지 경로
- `mapLinks`: 카카오맵, 네이버지도, 티맵, 구글맵 링크
- `accounts`: 신랑측/신부측 계좌 정보

전화번호와 계좌번호는 공개 페이지에 그대로 노출됩니다. 실제 값을 입력하기 전에 공개 가능 여부를 반드시 확인합니다.

## 이미지 교체 방법

1. `public/images` 폴더를 만들고 이미지를 넣습니다.
2. 대표 이미지는 `public/images/hero.jpg`로 둡니다.
3. 공유 이미지는 `public/images/og-image.jpg`로 둡니다.
4. 갤러리는 `public/images/gallery-01.jpg`, `gallery-02.jpg`처럼 연속된 이름을 권장합니다.
5. 파일명을 바꾸면 `src/data/wedding.ts`의 `images`와 `meta.ogImage` 경로도 함께 수정합니다.
6. 배포 전 모바일 로딩을 위해 이미지를 압축합니다.

## 공유 미리보기 확인

- `src/data/wedding.ts`의 `meta.url`이 실제 배포 URL인지 확인합니다.
- `meta.title`, `meta.description`, `meta.ogImage`가 원하는 값인지 확인합니다.
- `public/images/og-image.jpg` 파일이 실제로 존재하는지 확인합니다.
- 배포 후 카카오톡 대화방 또는 문자 앱에 URL을 붙여 넣어 제목/설명/이미지가 표시되는지 확인합니다.
- 미리보기가 이전 값으로 보이면 각 플랫폼의 캐시 갱신 도구를 사용하거나 URL이 최신 배포 주소인지 다시 확인합니다.

## 핵심 원칙

작게 나누어 구현합니다. 한 번에 전체를 맡기지 말고, 티켓 하나씩 Codex에게 지시합니다.
