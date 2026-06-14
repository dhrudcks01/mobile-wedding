---

# File: `README.md`

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

## 추천 명령

```bash
# 프로젝트 생성 예시
pnpm create next-app@latest mobile-wedding --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd mobile-wedding

# 문서 복사 후 Codex 실행
codex
```

## 핵심 원칙

작게 나누어 구현합니다. 한 번에 전체를 맡기지 말고, 티켓 하나씩 Codex에게 지시합니다.


---

# File: `AGENTS.md`

# AGENTS.md

이 파일은 Codex가 `mobile-wedding` 레포지토리에서 작업하기 전에 반드시 참고해야 하는 프로젝트 지침입니다.

## 프로젝트 개요

`mobile-wedding`은 개인용 단일 모바일 청첩장입니다.

범위:

- Next.js + React + TypeScript 기반 단일 프론트엔드 프로젝트
- Spring Boot 사용 금지
- DB 사용 금지
- 관리자 페이지 구현 금지
- 회원가입/로그인 구현 금지
- 여러 커플 관리 구현 금지
- RSVP 저장/방명록 저장은 현재 범위에서 제외

## 우선순위

1. 모바일에서 예쁜 청첩장 UI
2. 빠른 초기 로딩
3. 카카오톡/문자 공유 시 OG metadata 표시
4. 지도 앱 링크
5. 갤러리, 연락하기, 계좌번호 복사
6. 유지보수하기 쉬운 정적 데이터 구조

## 기술 스택

- Framework: Next.js App Router
- Language: TypeScript
- UI: React
- Styling: Tailwind CSS
- Data: `src/data/wedding.ts`
- Images: `public/images`
- Backend: 없음
- Database: 없음

## 작업 방식

- 반드시 `docs/PRD.md`, `docs/PROJECT_STRUCTURE.md`, `docs/TICKETS.md`를 먼저 읽고 작업한다.
- 한 번에 하나의 티켓만 구현한다.
- 티켓 범위를 넘어서는 기능을 추가하지 않는다.
- 새 production dependency 추가 전에는 이유를 설명하고 확인을 요청한다.
- Spring Boot, MySQL, PostgreSQL, Prisma, ORM, API 서버를 추가하지 않는다.
- 단순한 청첩장 데이터는 반드시 `src/data/wedding.ts`에서 가져온다.
- 컴포넌트는 작게 나눈다.
- 모바일 360px~430px 화면을 최우선으로 한다.
- 데스크톱에서는 중앙에 모바일 폭 컨테이너로 표시한다.

## 검증 명령

작업 후 가능한 범위에서 아래 명령을 실행한다.

```bash
pnpm lint
pnpm build
```

테스트 또는 빌드가 실패하면 실패 원인과 수정 내용을 요약한다.

## 구현 규칙

- `src/app/page.tsx`는 섹션 컴포넌트를 조립하는 역할만 담당한다.
- 재사용 UI는 `src/components/common` 아래에 둔다.
- 청첩장 섹션은 `src/components/invitation` 아래에 둔다.
- 날짜 계산은 `src/lib/date.ts`에 둔다.
- 캘린더 생성은 `src/lib/calendar.ts`에 둔다.
- 공유 관련 코드는 `src/lib/share.ts`에 둔다.
- 지도 링크 관련 코드는 `src/lib/map.ts`에 둔다.
- 민감한 실제 전화번호/계좌번호는 예시값으로 커밋하지 않는다. 실제 값 입력 전까지 placeholder를 사용한다.

## 완료 보고 형식

작업 완료 후 아래 형식으로 보고한다.

```txt
완료 티켓: MW-XX
변경 파일:
- ...
검증:
- pnpm lint: pass/fail/not run
- pnpm build: pass/fail/not run
주의사항:
- ...
다음 추천 티켓:
- MW-YY
```


---

# File: `docs/PRD.md`

# mobile-wedding PRD

문서 버전: v1.0  
기준일: 2026-06-14  
프로젝트명: `mobile-wedding`

## 1. 제품 정의

`mobile-wedding`은 개인이 직접 사용할 단일 모바일 청첩장입니다. 여러 커플이 가입해서 청첩장을 만드는 플랫폼이 아니며, 관리자 대시보드나 데이터베이스를 전제로 하지 않습니다.

## 2. 최종 결정

```txt
Next.js + React + TypeScript 단일 프로젝트로 시작한다.
Spring Boot는 사용하지 않는다.
MySQL/PostgreSQL 등 DB는 사용하지 않는다.
청첩장 데이터는 TypeScript 설정 파일에서 관리한다.
이미지는 public/images에 저장한다.
```

## 3. 범위

### 포함

- 모바일 청첩장 메인 페이지
- Hero 섹션
- 초대 문구
- 신랑/신부 정보
- 예식 일시
- D-day 표시
- 캘린더 저장
- 장소 안내
- 지도 앱 링크
- 갤러리
- 연락하기
- 계좌번호 보기/복사
- 링크 복사
- Web Share API
- 카카오톡 공유
- OG metadata
- 모바일 반응형 UI

### 제외

- Spring Boot API
- MySQL/PostgreSQL DB
- 관리자 페이지
- 회원가입/로그인
- 여러 커플 관리
- RSVP 저장
- 방명록 저장
- 결제
- 통계
- 템플릿 마켓

## 4. 사용자 흐름

```txt
1. 하객이 카카오톡/문자로 링크를 받는다.
2. 모바일 브라우저에서 청첩장을 연다.
3. 신랑/신부와 예식 정보를 확인한다.
4. 갤러리 사진을 본다.
5. 지도 앱으로 길찾기를 실행한다.
6. 필요하면 연락하기 또는 계좌번호 복사를 사용한다.
7. 다른 사람에게 링크를 공유한다.
```

## 5. 페이지 구성

단일 페이지로 구현합니다.

```txt
/
```

섹션 순서:

```txt
1. Hero
2. Greeting
3. Couple
4. Date
5. Calendar
6. Location
7. Gallery
8. Contact
9. Account
10. Share
11. Footer
```

## 6. 상세 기능

### 6.1 Hero

목적: 청첩장 첫인상 제공

요구사항:

- 대표 이미지 표시
- 신랑/신부 이름 표시
- 예식 날짜 표시
- 예식 장소 표시
- 모바일 첫 화면에서 보기 좋은 세로형 구성
- 대표 이미지는 우선 로딩 대상

### 6.2 Greeting

요구사항:

- 초대 문구 표시
- 줄바꿈 유지
- 가운데 정렬
- 모바일 가독성을 위한 충분한 행간

### 6.3 Couple

요구사항:

- 신랑 이름
- 신부 이름
- 부모님 성함
- 전화/문자 버튼은 설정값에 따라 노출

### 6.4 Date

요구사항:

- 예식 일시 표시
- D-day 자동 계산
- 예식일이 지난 경우 `함께해 주셔서 감사합니다` 또는 `D+N` 표시 가능

### 6.5 Calendar

요구사항:

- `.ics` 파일 다운로드 버튼
- 이벤트 제목, 시작 시간, 종료 시간, 장소, 설명 포함
- 서버 없이 브라우저에서 파일 생성

### 6.6 Location

요구사항:

- 웨딩홀명
- 주소
- 층/홀명
- 주차 안내
- 대중교통 안내
- 카카오맵/네이버지도/티맵/구글맵 링크

MVP에서는 지도 API 임베드를 필수로 하지 않습니다. 지도 앱 링크가 우선입니다.

### 6.7 Gallery

요구사항:

- 대표 이미지와 갤러리 이미지 분리
- 6~12장 권장
- 썸네일 그리드
- 클릭 시 크게 보기
- 원본 이미지 전체를 초기 로딩하지 않기

### 6.8 Contact

요구사항:

- 신랑에게 전화/문자
- 신부에게 전화/문자
- 전화번호 미입력 시 버튼 숨김

### 6.9 Account

요구사항:

- 기본 접힘 상태
- 신랑측/신부측 구분
- 계좌번호 복사
- 복사 완료 토스트

주의:

- 실제 계좌번호는 공개 페이지에 노출되는 정보입니다.
- 커밋 전 예시값인지 실제값인지 확인합니다.

### 6.10 Share

요구사항:

- 링크 복사
- Web Share API 지원 브라우저에서는 기본 공유창 사용
- 카카오톡 공유 버튼
- 공유 미지원 환경 fallback 처리

### 6.11 OG metadata

요구사항:

- `title`
- `description`
- `openGraph.title`
- `openGraph.description`
- `openGraph.images`
- `openGraph.url`
- `twitter.card`

## 7. 데이터 설계

DB 대신 TypeScript 파일로 관리합니다.

예상 위치:

```txt
src/data/wedding.ts
```

예시:

```ts
export const wedding = {
  meta: {
    title: '민준 & 소연 결혼합니다',
    description: '2026년 10월 24일 토요일 오후 1시, OO 웨딩홀',
    url: 'https://example.com',
    ogImage: '/images/og-image.jpg',
  },
  couple: {
    groom: {
      name: '민준',
      phone: '',
      father: '홍길동',
      mother: '김영희',
    },
    bride: {
      name: '소연',
      phone: '',
      father: '박길동',
      mother: '이영희',
    },
  },
  event: {
    dateTime: '2026-10-24T13:00:00+09:00',
    displayDate: '2026년 10월 24일 토요일 오후 1시',
    venueName: 'OO 웨딩홀',
    hallName: '3층 그랜드홀',
    address: '서울특별시 ...',
    parking: '건물 지하 주차장 이용 가능',
    transport: '지하철 O호선 OO역 1번 출구 도보 5분',
  },
  greeting: `서로가 마주 보며 다져온 사랑을
이제 함께 한 곳을 바라보며 걸어가고자 합니다.

귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  images: {
    hero: '/images/hero.jpg',
    gallery: [
      '/images/gallery-01.jpg',
      '/images/gallery-02.jpg',
      '/images/gallery-03.jpg',
    ],
  },
  mapLinks: {
    kakao: '',
    naver: '',
    tmap: '',
    google: '',
  },
  accounts: [
    {
      side: 'groom',
      label: '신랑측',
      bank: '국민은행',
      holder: '민준',
      number: '',
    },
  ],
}
```

## 8. 비기능 요구사항

### 성능

- 모바일 첫 로딩이 가벼워야 한다.
- Hero 외 이미지는 lazy loading한다.
- 이미지 용량은 배포 전 압축한다.
- 지도 SDK는 MVP에서 로딩하지 않는다.

### 접근성

- 버튼에는 명확한 label을 둔다.
- 이미지에는 가능한 `alt`를 둔다.
- 텍스트 대비를 확보한다.
- 터치 영역은 모바일에서 누르기 쉽게 한다.

### 보안/개인정보

- DB 저장이 없으므로 서버 측 개인정보 저장은 없다.
- 전화번호/계좌번호는 공개 페이지에 노출된다.
- 실제 개인정보를 커밋하기 전에 공개 여부를 확인한다.

## 9. 배포

1순위: Vercel  
2순위: 정적 export + Cloudflare Pages/GitHub Pages/S3

## 10. 향후 확장 기준

아래 기능이 필요해질 때만 DB를 검토합니다.

- RSVP 저장
- 방명록 저장
- 관리자 화면에서 내용 수정
- 방문 통계
- 여러 청첩장 관리

이때도 먼저 MySQL을 검토합니다. 사용자가 기존에 MySQL에 익숙하고, 이 프로젝트의 확장 데이터는 일반적인 관계형 테이블로 충분하기 때문입니다.


---

# File: `docs/PROJECT_STRUCTURE.md`

# mobile-wedding 프로젝트 구조

## 1. 문서 세트를 먼저 넣을 위치

새 레포지토리 생성 직후 아래처럼 문서를 넣습니다.

```txt
mobile-wedding/
  AGENTS.md
  README.md
  .agents/
    skills/
      mobile-wedding-implementation/
        SKILL.md
      mobile-wedding-review/
        SKILL.md
  docs/
    PRD.md
    PROJECT_STRUCTURE.md
    TICKETS.md
    CODEX_WORKFLOW.md
    CODEX_PROMPTS.md
    QA_CHECKLIST.md
```

그 다음 Next.js 프로젝트를 생성하거나, 이미 생성된 Next.js 프로젝트에 위 문서를 복사합니다.

## 2. 구현 완료 후 목표 구조

```txt
mobile-wedding/
  AGENTS.md
  README.md
  package.json
  next.config.ts
  tsconfig.json
  postcss.config.mjs
  eslint.config.mjs

  public/
    images/
      hero.jpg
      og-image.jpg
      gallery-01.jpg
      gallery-02.jpg
      gallery-03.jpg
      gallery-04.jpg
      gallery-05.jpg
      gallery-06.jpg

  src/
    app/
      globals.css
      layout.tsx
      page.tsx

    components/
      common/
        Button.tsx
        CopyButton.tsx
        Section.tsx
        Toast.tsx
      invitation/
        HeroSection.tsx
        GreetingSection.tsx
        CoupleSection.tsx
        DateSection.tsx
        CalendarButton.tsx
        LocationSection.tsx
        GallerySection.tsx
        ContactSection.tsx
        AccountSection.tsx
        ShareSection.tsx
        Footer.tsx

    data/
      wedding.ts

    lib/
      calendar.ts
      date.ts
      map.ts
      share.ts

    types/
      wedding.ts

  .agents/
    skills/
      mobile-wedding-implementation/
        SKILL.md
      mobile-wedding-review/
        SKILL.md

  docs/
    PRD.md
    PROJECT_STRUCTURE.md
    TICKETS.md
    CODEX_WORKFLOW.md
    CODEX_PROMPTS.md
    QA_CHECKLIST.md
```

## 3. 각 폴더 역할

### `src/app`

Next.js App Router 진입점입니다.

- `layout.tsx`: metadata, 공통 HTML 구조
- `page.tsx`: 청첩장 섹션 조립
- `globals.css`: 전역 스타일

### `src/components/invitation`

청첩장 섹션 컴포넌트를 둡니다.

원칙:

- 각 섹션은 `wedding` 데이터를 props로 받거나 직접 import합니다.
- 복잡한 계산은 컴포넌트 안에서 하지 않습니다.
- 계산은 `src/lib`로 분리합니다.

### `src/components/common`

공통 UI를 둡니다.

예:

- Button
- Section
- CopyButton
- Toast

### `src/data`

정적 청첩장 데이터를 둡니다.

DB가 없기 때문에 이 프로젝트에서 가장 중요한 데이터 진입점입니다.

### `src/lib`

비즈니스 로직과 브라우저 API 래퍼를 둡니다.

예:

- 날짜 계산
- `.ics` 파일 생성
- 공유 API
- 지도 앱 링크 생성

### `public/images`

실제 이미지를 저장합니다.

파일명 규칙:

```txt
hero.jpg
og-image.jpg
gallery-01.jpg
gallery-02.jpg
...
```

## 4. Codex 작업 순서

1. `MW-00`: Next.js 프로젝트 세팅
2. `MW-01`: 데이터 모델 작성
3. `MW-02`: 전역 스타일과 레이아웃
4. `MW-03`: Hero/Greeting
5. `MW-04`: Couple/Contact
6. `MW-05`: Date/Calendar
7. `MW-06`: Location/Map links
8. `MW-07`: Gallery
9. `MW-08`: Account copy
10. `MW-09`: Share/OG/Kakao
11. `MW-10`: QA/성능/마무리

## 5. 피해야 할 구조

```txt
backend/
server/
spring/
api/
database/
prisma/
```

현재 범위에서는 위 폴더를 만들지 않습니다.


---

# File: `docs/TICKETS.md`

# mobile-wedding 티켓 백로그

이 문서는 Codex에게 작업을 시킬 때 기준이 되는 티켓 목록입니다.

## 티켓 운영 원칙

- 티켓 하나당 Codex 작업 하나를 원칙으로 한다.
- 한 티켓에서 다른 티켓 범위까지 구현하지 않는다.
- 각 티켓 완료 후 `pnpm lint`, `pnpm build`를 실행한다.
- 완료된 티켓은 체크박스를 체크한다.
- 큰 변경은 커밋을 분리한다.

## 공통 완료 보고 형식

```txt
완료 티켓: MW-XX
변경 파일:
- ...
검증:
- pnpm lint: pass/fail/not run
- pnpm build: pass/fail/not run
남은 이슈:
- ...
```

---

## MW-00. 프로젝트 세팅

상태: [ ] todo

### 목표

Next.js + TypeScript + Tailwind CSS 기반 프로젝트를 생성하고 기본 실행이 가능하게 한다.

### 범위

- Next.js App Router 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- ESLint 설정
- 기본 `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` 확인
- 문서 폴더 유지
- `pnpm dev`, `pnpm lint`, `pnpm build` 실행 가능 상태 만들기

### 제외

- 청첩장 UI 구현
- 이미지 추가
- 카카오 공유 구현
- DB/API 구현

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-00 티켓만 구현해줘.
Next.js + TypeScript + Tailwind CSS 기반으로 mobile-wedding 프로젝트를 세팅하고, Spring Boot/DB/API는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] `pnpm dev` 실행 가능
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 통과
- [ ] 불필요한 backend/db 폴더 없음

---

## MW-01. 정적 데이터 모델 작성

상태: [ ] todo

### 목표

청첩장 데이터를 한 곳에서 관리할 수 있게 `src/data/wedding.ts`와 타입을 만든다.

### 범위

- `src/types/wedding.ts`
- `src/data/wedding.ts`
- meta, couple, event, greeting, images, mapLinks, accounts 구조 정의
- 예시 데이터는 placeholder로 작성

### 제외

- UI 구현
- 실제 개인정보 입력
- DB/환경변수 사용

### Codex 프롬프트

```txt
AGENTS.md와 docs/PRD.md를 읽고 MW-01 티켓만 구현해줘.
src/types/wedding.ts와 src/data/wedding.ts를 만들고, 개인용 단일 청첩장 정적 데이터 구조를 정의해줘.
실제 전화번호/계좌번호는 placeholder 또는 빈 문자열로 둬.
DB, API, 환경변수는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] `src/types/wedding.ts` 존재
- [ ] `src/data/wedding.ts` 존재
- [ ] 타입 오류 없음
- [ ] 개인정보 placeholder 처리

---

## MW-02. 전역 레이아웃과 디자인 시스템 기초

상태: [ ] todo

### 목표

모바일 청첩장 전체 레이아웃과 공통 UI 기초를 만든다.

### 범위

- `src/app/layout.tsx` 기본 metadata
- `src/app/page.tsx` 모바일 컨테이너
- `src/app/globals.css` 기본 색상/타이포그래피
- `src/components/common/Section.tsx`
- `src/components/common/Button.tsx`

### 디자인 방향

- 따뜻한 ivory/beige/warm gray 톤
- 모바일 폭 우선
- 데스크톱에서는 중앙 모바일 카드 형태
- 과한 애니메이션 금지

### Codex 프롬프트

```txt
AGENTS.md, docs/PRD.md, docs/PROJECT_STRUCTURE.md를 읽고 MW-02 티켓만 구현해줘.
모바일 청첩장용 전역 레이아웃, globals.css, Section/Button 공통 컴포넌트를 만들어줘.
아직 각 청첩장 섹션 구현은 하지 말고 page.tsx에는 기본 컨테이너와 자리표시 정도만 둬.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 모바일 컨테이너 적용
- [ ] 공통 Section/Button 컴포넌트 존재
- [ ] 디자인 톤이 PRD와 맞음

---

## MW-03. Hero와 Greeting 섹션

상태: [ ] todo

### 목표

청첩장 첫 화면과 초대 문구를 구현한다.

### 범위

- `HeroSection.tsx`
- `GreetingSection.tsx`
- `page.tsx`에 섹션 연결
- `wedding.ts` 데이터 사용
- Hero 이미지 placeholder 처리

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-03 티켓만 구현해줘.
HeroSection과 GreetingSection을 만들고 src/data/wedding.ts 데이터를 사용해서 page.tsx에 연결해줘.
모바일 첫 화면에서 예쁘게 보이도록 구현하되, 새 라이브러리는 추가하지 마.
이미지는 public/images/hero.jpg 경로를 사용하되 파일이 없어도 레이아웃이 깨지지 않게 처리해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] Hero 섹션 표시
- [ ] 신랑/신부 이름 표시
- [ ] 날짜/장소 표시
- [ ] 초대 문구 줄바꿈 유지

---

## MW-04. Couple과 Contact 섹션

상태: [ ] todo

### 목표

신랑/신부 및 가족 정보, 연락하기 버튼을 구현한다.

### 범위

- `CoupleSection.tsx`
- `ContactSection.tsx`
- 전화번호가 없으면 버튼 숨김
- `tel:`, `sms:` 링크

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-04 티켓만 구현해줘.
CoupleSection과 ContactSection을 만들어 신랑/신부 정보와 연락하기 버튼을 표시해줘.
전화번호가 빈 문자열이면 전화/문자 버튼은 렌더링하지 마.
개인정보가 공개 페이지에 노출된다는 점을 고려해서 데이터는 src/data/wedding.ts의 값만 사용해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 신랑/신부 정보 표시
- [ ] 부모님 정보 표시
- [ ] 전화번호 없을 때 버튼 숨김
- [ ] 전화/문자 링크 정상 생성

---

## MW-05. Date와 Calendar 기능

상태: [ ] todo

### 목표

예식 일시, D-day, 캘린더 저장 기능을 구현한다.

### 범위

- `DateSection.tsx`
- `CalendarButton.tsx`
- `src/lib/date.ts`
- `src/lib/calendar.ts`
- 브라우저에서 `.ics` 파일 생성 후 다운로드

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-05 티켓만 구현해줘.
DateSection, CalendarButton, src/lib/date.ts, src/lib/calendar.ts를 구현해줘.
D-day를 계산하고, 버튼 클릭 시 예식 일정 .ics 파일을 브라우저에서 생성해 다운로드되게 해줘.
서버 API는 만들지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 예식 일시 표시
- [ ] D-day 계산
- [ ] `.ics` 다운로드
- [ ] 서버/API 없음

---

## MW-06. Location과 지도 앱 링크

상태: [ ] todo

### 목표

장소 안내와 지도 앱 링크 버튼을 구현한다.

### 범위

- `LocationSection.tsx`
- `src/lib/map.ts`
- 카카오맵/네이버지도/티맵/구글맵 링크
- 주소 복사 기능은 선택

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-06 티켓만 구현해줘.
LocationSection과 src/lib/map.ts를 만들어 웨딩홀명, 주소, 층/홀, 주차/교통 안내, 지도 앱 링크 버튼을 표시해줘.
지도 API SDK를 로딩하지 말고, wedding.ts의 mapLinks 값으로 외부 지도 앱 링크만 연결해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 장소명/주소/홀 정보 표시
- [ ] 주차/교통 안내 표시
- [ ] 지도 앱 링크 표시
- [ ] 지도 SDK 추가 없음

---

## MW-07. Gallery 섹션

상태: [ ] todo

### 목표

갤러리 이미지 그리드와 크게 보기 기능을 구현한다.

### 범위

- `GallerySection.tsx`
- 썸네일 그리드
- 클릭 시 모달 크게 보기
- 좌우 이동은 가능하면 구현
- 새 라이브러리 추가 금지

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-07 티켓만 구현해줘.
GallerySection을 만들어 wedding.ts의 images.gallery 배열을 표시해줘.
썸네일 클릭 시 모달로 크게 볼 수 있게 하고, 새 이미지/슬라이더 라이브러리는 추가하지 마.
이미지 파일이 없어도 빌드가 깨지지 않게 경로 기반으로만 구현해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 갤러리 그리드 표시
- [ ] 이미지 클릭 시 모달 표시
- [ ] 모달 닫기 가능
- [ ] 새 라이브러리 없음

---

## MW-08. Account 섹션과 복사 기능

상태: [ ] todo

### 목표

계좌번호 접힘 UI와 복사 기능을 구현한다.

### 범위

- `AccountSection.tsx`
- `CopyButton.tsx`
- `Toast.tsx` 또는 간단한 복사 완료 피드백
- 기본 접힘 상태

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-08 티켓만 구현해줘.
AccountSection, CopyButton, 필요한 경우 Toast를 구현해줘.
계좌번호는 기본 접힘 상태로 두고, 사용자가 펼쳤을 때 신랑측/신부측 계좌와 복사 버튼을 표시해줘.
복사 성공/실패 피드백을 보여줘.
DB나 서버 저장은 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 기본 접힘 상태
- [ ] 계좌 목록 표시
- [ ] 복사 기능
- [ ] 복사 피드백

---

## MW-09. Share와 OG/Kakao 공유

상태: [ ] todo

### 목표

공유 기능과 OG metadata를 구현한다.

### 범위

- `ShareSection.tsx`
- `src/lib/share.ts`
- 링크 복사
- Web Share API
- 카카오톡 공유 SDK 로딩 구조
- Next.js metadata 설정

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-09 티켓만 구현해줘.
ShareSection과 src/lib/share.ts를 만들어 링크 복사, Web Share API, 카카오톡 공유 버튼 구조를 구현해줘.
Next.js metadata/openGraph/twitter 설정도 wedding.ts의 meta 데이터를 사용해서 적용해줘.
카카오 JavaScript 키는 실제 값 없이 환경변수 placeholder 또는 안전한 fallback으로 처리하고, 키가 없으면 카카오 공유 버튼은 비활성/안내 처리해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 링크 복사 가능
- [ ] Web Share API 지원
- [ ] 카카오톡 공유 fallback 있음
- [ ] OG metadata 설정

---

## MW-10. 모바일 QA, 성능, 마무리

상태: [ ] todo

### 목표

모바일 사용성을 점검하고 배포 전 품질을 높인다.

### 범위

- 360px/390px/430px 모바일 레이아웃 점검
- 빈 데이터 fallback
- 이미지 alt 확인
- 버튼 aria-label 확인
- 빌드 경고 정리
- README 업데이트
- QA_CHECKLIST 체크

### Codex 프롬프트

```txt
AGENTS.md, docs/QA_CHECKLIST.md, docs/TICKETS.md를 읽고 MW-10 티켓만 구현해줘.
모바일 레이아웃, 접근성, 빈 데이터 fallback, 빌드 경고를 점검하고 필요한 수정만 해줘.
새 기능은 추가하지 말고 품질 개선에 집중해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] 모바일 레이아웃 깨짐 없음
- [ ] 주요 버튼 label 존재
- [ ] 빈 데이터 fallback 존재
- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 통과
- [ ] README 업데이트

---

## MW-11. 배포 문서 정리

상태: [ ] todo

### 목표

Vercel 또는 정적 배포 방법을 README에 정리한다.

### 범위

- Vercel 배포 절차
- 환경변수 placeholder 설명
- 이미지 교체 방법
- 실제 결혼식 정보 입력 위치
- 공유 미리보기 확인 방법

### Codex 프롬프트

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-11 티켓만 구현해줘.
README에 배포 방법, 실제 데이터 입력 위치, 이미지 교체 방법, 공유 미리보기 확인 방법을 정리해줘.
코드 변경은 필요한 경우에만 최소화해줘.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

### 완료 기준

- [ ] README에 배포 절차 있음
- [ ] 데이터 입력 위치 명시
- [ ] 이미지 교체 방법 명시
- [ ] 공유 미리보기 확인 방법 명시


---

# File: `docs/CODEX_WORKFLOW.md`

# Codex 작업 방식

이 문서는 `mobile-wedding` 프로젝트를 Codex에게 맡기는 방법을 정리합니다.

## 1. 기본 원칙

이 프로젝트는 티켓 방식으로 진행합니다.

이유:

- 개인용 청첩장은 기능 수가 많지 않지만, 섹션별 UI 품질이 중요합니다.
- 한 번에 전부 맡기면 디자인/구조/상태 관리가 섞여 리뷰가 어려워집니다.
- 티켓 단위로 맡기면 결과물을 확인하고 다음 티켓에 반영하기 쉽습니다.

## 2. 권장 작업 단위

```txt
1 task = 1 ticket = 1 branch = 1 commit 또는 1 PR
```

예:

```txt
feat/mw-03-hero-greeting
feat/mw-04-couple-contact
feat/mw-07-gallery
```

## 3. 새 레포지토리 시작 순서

### 3.1 레포지토리 생성

```bash
mkdir mobile-wedding
cd mobile-wedding
git init
```

### 3.2 문서 복사

이 문서 세트를 레포지토리 루트에 복사합니다.

```txt
mobile-wedding/
  AGENTS.md
  README.md
  .agents/skills/...
  docs/...
```

### 3.3 Codex 실행

```bash
codex
```

또는 Codex 앱/IDE에서 `mobile-wedding` 폴더를 엽니다.

## 4. Codex에게 첫 작업 시키기

처음에는 `MW-00`만 맡깁니다.

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-00 티켓만 구현해줘.
Next.js + TypeScript + Tailwind CSS 기반으로 mobile-wedding 프로젝트를 세팅하고, Spring Boot/DB/API는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

## 5. 매 티켓 작업 루틴

### 5.1 브랜치 생성

```bash
git checkout -b feat/mw-XX-ticket-name
```

### 5.2 Codex에게 티켓 지시

```txt
AGENTS.md, docs/PRD.md, docs/TICKETS.md를 읽고 MW-XX 티켓만 구현해줘.
범위를 벗어나는 기능은 추가하지 말고, 작업 후 pnpm lint와 pnpm build를 실행해줘.
완료 보고는 AGENTS.md 형식으로 해줘.
```

### 5.3 결과 확인

```bash
git diff
pnpm lint
pnpm build
```

### 5.4 리뷰 요청

```txt
방금 변경한 MW-XX 티켓을 리뷰해줘.
docs/PRD.md, docs/TICKETS.md, docs/QA_CHECKLIST.md 기준으로 범위 초과, 버그 가능성, 모바일 UX 문제, 접근성 문제를 찾아줘.
바로 수정하지 말고 먼저 목록으로 보고해줘.
```

### 5.5 수정 요청

```txt
리뷰에서 발견한 문제 중 1, 3, 4번만 수정해줘.
새 기능은 추가하지 말고 MW-XX 범위 안에서 수정해줘.
수정 후 pnpm lint와 pnpm build를 다시 실행해줘.
```

### 5.6 커밋

```bash
git add <changed-files>
git commit -m "feat: implement MW-XX ticket"
```

## 6. Skills 활용법

### 6.1 설치된 Skill 확인

Codex CLI/IDE에서 사용 가능한 Skill 목록을 먼저 확인합니다.

```txt
/skills
```

설치된 Skill 이름은 사용자 환경마다 다를 수 있습니다. 따라서 특정 Skill 이름을 추측하지 말고 `/skills`로 확인한 뒤 사용합니다.

### 6.2 Skill 명시 호출

사용할 Skill이 보이면 프롬프트에서 명시합니다.

```txt
$mobile-wedding-implementation 을 사용해서 MW-03 티켓만 구현해줘.
AGENTS.md와 docs/TICKETS.md를 기준으로 범위를 지켜줘.
작업 후 pnpm lint와 pnpm build를 실행해줘.
```

### 6.3 이 레포에 포함된 Skill

이 문서 세트에는 아래 repo-specific Skill이 포함되어 있습니다.

```txt
.agents/skills/mobile-wedding-implementation/SKILL.md
.agents/skills/mobile-wedding-review/SKILL.md
```

권장 사용:

```txt
$mobile-wedding-implementation 을 사용해서 MW-05 티켓을 구현해줘.
```

```txt
$mobile-wedding-review 를 사용해서 현재 변경사항을 리뷰해줘.
```

### 6.4 Skill 사용 시 주의사항

- Skill은 반복되는 작업 방식을 안정화하는 용도입니다.
- 모든 작업에 Skill을 억지로 붙이지 않습니다.
- UI 구현, 리뷰, QA처럼 반복되는 흐름에 사용합니다.
- Skill이 있더라도 최종 지시는 항상 티켓 번호와 완료 기준을 포함합니다.

## 7. Codex에게 한 번에 시키면 안 좋은 요청

피해야 할 요청:

```txt
전체 청첩장 프로젝트를 다 만들어줘.
```

```txt
기획서 보고 알아서 끝까지 구현해줘.
```

```txt
예쁘게 만들어줘.
```

이유:

- 범위가 넓어져서 검토가 어렵습니다.
- 원하지 않는 백엔드/DB/라이브러리가 추가될 수 있습니다.
- 디자인 결과가 취향과 다를 때 수정 범위가 커집니다.

## 8. 좋은 요청 예시

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-07 티켓만 구현해줘.
GallerySection만 만들고, 새 라이브러리는 추가하지 마.
이미지 클릭 시 모달로 크게 보기만 구현해줘.
좌우 슬라이드는 간단히 가능하면 구현하고, 복잡해지면 생략해도 돼.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

## 9. 중간 점검 질문

Codex 결과가 애매하면 아래처럼 질문합니다.

```txt
이번 변경에서 티켓 범위를 초과한 부분이 있는지 스스로 점검해줘.
```

```txt
새 dependency가 추가되었는지, 추가되었다면 꼭 필요한지 설명해줘.
```

```txt
모바일 360px 화면에서 깨질 가능성이 있는 부분을 알려줘.
```

```txt
실제 전화번호나 계좌번호 같은 민감정보가 코드에 들어갔는지 확인해줘.
```

```txt
Spring Boot, DB, API 관련 파일이 생성되었는지 확인해줘.
```

## 10. 작업 완료 전 필수 확인

- [ ] 티켓 범위만 구현했는가?
- [ ] Spring Boot/DB/API가 추가되지 않았는가?
- [ ] 실제 개인정보가 들어가지 않았는가?
- [ ] `pnpm lint`를 실행했는가?
- [ ] `pnpm build`를 실행했는가?
- [ ] 모바일 화면 기준으로 확인했는가?


---

# File: `docs/CODEX_PROMPTS.md`

# Codex 질문지 / 프롬프트 모음

이 문서는 Codex에게 바로 복사해서 사용할 수 있는 질문과 프롬프트입니다.

## 1. 공통 프롬프트 템플릿

```txt
AGENTS.md, docs/PRD.md, docs/PROJECT_STRUCTURE.md, docs/TICKETS.md를 읽고 [티켓번호] 티켓만 구현해줘.

지켜야 할 조건:
- Spring Boot 추가 금지
- DB 추가 금지
- 관리자/로그인/회원가입 추가 금지
- 새 production dependency 추가 전에는 이유를 설명하고 확인 요청
- 청첩장 데이터는 src/data/wedding.ts 사용
- 모바일 360px~430px 우선

작업 후:
- pnpm lint 실행
- pnpm build 실행
- 변경 파일 목록 보고
- 실패한 명령이 있으면 원인과 수정 방향 보고
```

## 2. Skill을 함께 쓰는 프롬프트

```txt
$mobile-wedding-implementation 을 사용해서 [티켓번호] 티켓만 구현해줘.
AGENTS.md와 docs/TICKETS.md의 범위를 지키고, 작업 후 pnpm lint와 pnpm build를 실행해줘.
완료 보고는 AGENTS.md의 형식으로 해줘.
```

리뷰용:

```txt
$mobile-wedding-review 를 사용해서 현재 변경사항을 리뷰해줘.
기준은 docs/PRD.md, docs/TICKETS.md, docs/QA_CHECKLIST.md야.
바로 수정하지 말고 문제 목록, 심각도, 추천 수정 순서만 먼저 알려줘.
```

## 3. 프로젝트 세팅 요청

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-00 티켓만 구현해줘.
Next.js + TypeScript + Tailwind CSS 기반으로 mobile-wedding 프로젝트를 세팅해줘.
Spring Boot, DB, API 서버, Prisma는 추가하지 마.
작업 후 pnpm lint와 pnpm build를 실행하고 결과를 보고해줘.
```

## 4. UI 섹션 구현 요청

```txt
AGENTS.md와 docs/TICKETS.md를 읽고 MW-03 티켓만 구현해줘.
HeroSection과 GreetingSection만 구현하고 page.tsx에 연결해줘.
wedding.ts 데이터를 사용하고, 이미지 파일이 없어도 레이아웃이 깨지지 않게 해줘.
새 라이브러리는 추가하지 마.
```

## 5. 디자인 개선 요청

```txt
현재 모바일 청첩장 UI를 점검하고, 고급스럽고 담백한 느낌이 나도록 Tailwind 스타일만 개선해줘.
기능 추가는 하지 말고, 컴포넌트 구조도 크게 바꾸지 마.
모바일 360px~430px 기준으로 여백, 글자 크기, 섹션 간격을 개선해줘.
작업 후 변경 이유를 섹션별로 설명해줘.
```

## 6. 반응형 점검 요청

```txt
현재 구현을 모바일 360px, 390px, 430px, 데스크톱 중앙 모바일 컨테이너 기준으로 점검해줘.
깨질 가능성이 있는 레이아웃, 너무 작은 버튼, 과도한 여백, 텍스트 줄바꿈 문제를 찾아줘.
바로 수정하지 말고 먼저 목록으로 보고해줘.
```

## 7. 접근성 점검 요청

```txt
docs/QA_CHECKLIST.md 기준으로 접근성을 점검해줘.
이미지 alt, 버튼 aria-label, 키보드 접근성, 색상 대비, 모달 닫기 동작을 확인해줘.
문제를 찾으면 최소 수정으로 고쳐줘.
작업 후 pnpm lint와 pnpm build를 실행해줘.
```

## 8. 성능 점검 요청

```txt
현재 프로젝트의 초기 로딩 성능을 점검해줘.
Hero 외 이미지가 과하게 로딩되는지, 불필요한 클라이언트 컴포넌트가 있는지, 지도 SDK나 무거운 라이브러리가 들어갔는지 확인해줘.
새 기능 추가 없이 성능 개선만 해줘.
작업 후 변경 내용을 설명하고 pnpm build를 실행해줘.
```

## 9. 공유/OG 점검 요청

```txt
ShareSection과 metadata 설정을 점검해줘.
카카오톡/문자 공유 시 title, description, image가 잘 잡히도록 Next.js metadata가 wedding.ts의 meta 값을 사용하고 있는지 확인해줘.
카카오 JS 키가 없을 때도 빌드가 실패하지 않게 fallback을 확인해줘.
```

## 10. 민감정보 점검 요청

```txt
현재 레포지토리에 실제 전화번호, 실제 계좌번호, 실제 주소, API key가 하드코딩되어 있는지 확인해줘.
발견하면 파일명과 위치를 알려주고, placeholder로 바꿔줘.
```

## 11. 범위 초과 점검 요청

```txt
현재 변경사항 중 이 프로젝트 범위를 벗어난 부분이 있는지 확인해줘.
특히 Spring Boot, DB, API 서버, 관리자, 로그인, 회원가입, Prisma, ORM, analytics 라이브러리가 추가되었는지 확인해줘.
범위 초과가 있으면 제거 계획을 제안해줘.
```

## 12. 버그 수정 요청

```txt
아래 오류를 고쳐줘.

오류 내용:
[여기에 터미널 오류 붙여넣기]

조건:
- 원인부터 설명
- 최소 수정
- 티켓 범위 밖 기능 추가 금지
- 수정 후 pnpm lint와 pnpm build 실행
```

## 13. 코드 리뷰 요청

```txt
현재 diff를 코드 리뷰해줘.
검토 기준:
- 티켓 요구사항 충족 여부
- 불필요한 dependency 추가 여부
- 모바일 UX 문제
- 접근성 문제
- TypeScript 타입 안정성
- 빌드 실패 가능성
- 개인정보 노출 가능성

바로 수정하지 말고, 심각도 순서로 리뷰 코멘트만 작성해줘.
```

## 14. 커밋 메시지 요청

```txt
현재 변경사항을 보고 적절한 커밋 메시지를 추천해줘.
형식은 Conventional Commits로 해줘.
예: feat: implement wedding hero section
```

## 15. 배포 전 최종 점검 요청

```txt
docs/QA_CHECKLIST.md 기준으로 배포 전 최종 점검을 해줘.
실패한 항목은 파일 위치와 수정 방법을 알려줘.
바로 수정하지 말고 먼저 점검 결과만 보고해줘.
```


---

# File: `docs/QA_CHECKLIST.md`

# mobile-wedding QA 체크리스트

## 1. 기본 동작

- [ ] `/` 접속 시 청첩장 페이지가 열린다.
- [ ] 신랑/신부 이름이 표시된다.
- [ ] 예식 날짜와 시간이 표시된다.
- [ ] 장소명이 표시된다.
- [ ] 주소가 표시된다.
- [ ] 초대 문구 줄바꿈이 유지된다.

## 2. 모바일 레이아웃

확인 화면:

- [ ] 360px width
- [ ] 390px width
- [ ] 430px width
- [ ] 768px width
- [ ] desktop width

확인 항목:

- [ ] 가로 스크롤이 생기지 않는다.
- [ ] 텍스트가 너무 작지 않다.
- [ ] 버튼 터치 영역이 충분하다.
- [ ] 섹션 간격이 과도하거나 부족하지 않다.
- [ ] Hero 이미지가 비정상적으로 잘리지 않는다.
- [ ] 계좌번호 영역이 모바일에서 넘치지 않는다.

## 3. 갤러리

- [ ] 갤러리 이미지가 표시된다.
- [ ] 이미지 클릭 시 크게 보기 모달이 열린다.
- [ ] 모달을 닫을 수 있다.
- [ ] 이미지가 없어도 페이지가 깨지지 않는다.
- [ ] 초기 로딩 시 모든 원본 이미지를 강제로 로딩하지 않는다.

## 4. 연락하기

- [ ] 전화번호가 있으면 전화 버튼이 표시된다.
- [ ] 전화번호가 없으면 전화 버튼이 숨겨진다.
- [ ] 문자 버튼 링크가 정상 생성된다.
- [ ] 실제 개인정보가 placeholder인지 확인했다.

## 5. 계좌번호

- [ ] 기본 접힘 상태다.
- [ ] 펼치면 계좌번호가 표시된다.
- [ ] 복사 버튼이 동작한다.
- [ ] 복사 성공 피드백이 표시된다.
- [ ] 실제 계좌번호 공개 여부를 확인했다.

## 6. 지도/위치

- [ ] 카카오맵 링크가 동작한다.
- [ ] 네이버지도 링크가 동작한다.
- [ ] 티맵 링크가 동작한다.
- [ ] 구글맵 링크가 동작한다.
- [ ] 지도 SDK가 불필요하게 로딩되지 않는다.

## 7. 캘린더

- [ ] 캘린더 저장 버튼이 표시된다.
- [ ] `.ics` 파일이 다운로드된다.
- [ ] 일정 제목이 올바르다.
- [ ] 일정 시간이 올바르다.
- [ ] 장소 정보가 포함된다.

## 8. 공유

- [ ] 링크 복사가 동작한다.
- [ ] Web Share API 지원 브라우저에서 공유창이 열린다.
- [ ] Web Share API 미지원 브라우저에서 fallback이 동작한다.
- [ ] 카카오 JS 키가 없을 때 빌드가 실패하지 않는다.
- [ ] 카카오 공유 버튼 fallback이 있다.

## 9. OG metadata

- [ ] title 설정
- [ ] description 설정
- [ ] openGraph title 설정
- [ ] openGraph description 설정
- [ ] openGraph image 설정
- [ ] twitter card 설정
- [ ] `og-image.jpg` 파일 존재

## 10. 접근성

- [ ] 주요 이미지에 alt가 있다.
- [ ] 버튼 텍스트가 명확하다.
- [ ] 아이콘만 있는 버튼에는 aria-label이 있다.
- [ ] 모달은 닫기 버튼이 있다.
- [ ] 키보드로 닫기 가능한지 확인했다.
- [ ] 텍스트 대비가 너무 낮지 않다.

## 11. 빌드/품질

- [ ] `pnpm lint` 통과
- [ ] `pnpm build` 통과
- [ ] 불필요한 dependency 없음
- [ ] Spring Boot 관련 파일 없음
- [ ] DB/Prisma/ORM 관련 파일 없음
- [ ] API route가 불필요하게 추가되지 않음

## 12. 배포 전 개인정보 확인

- [ ] 실제 전화번호가 들어가는 위치를 확인했다.
- [ ] 실제 계좌번호가 들어가는 위치를 확인했다.
- [ ] 실제 주소가 들어가는 위치를 확인했다.
- [ ] API key가 커밋되지 않았는지 확인했다.
- [ ] 공개해도 되는 정보만 포함되어 있다.


---

# File: `.agents/skills/mobile-wedding-implementation/SKILL.md`

---
name: mobile-wedding-implementation
description: Implement one MW-* ticket for the mobile-wedding personal Next.js mobile invitation. Use when asked to build a section, implement a ticket, or modify the wedding invitation UI while respecting the no-backend/no-database scope.
---

# mobile-wedding implementation skill

Use this skill when implementing a `MW-*` ticket for the `mobile-wedding` repository.

## Required context

Before editing files, read:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `docs/PROJECT_STRUCTURE.md`
4. `docs/TICKETS.md`

If the user named a specific ticket, implement only that ticket.

## Hard constraints

- Do not add Spring Boot.
- Do not add a database.
- Do not add Prisma, ORM, migrations, or API server code.
- Do not add admin, login, signup, or multi-couple features.
- Do not add RSVP persistence or guestbook persistence.
- Do not add a production dependency unless the user explicitly approves.
- Use `src/data/wedding.ts` as the source of truth.
- Keep the project optimized for mobile screens first.

## Implementation approach

1. Identify the exact ticket from `docs/TICKETS.md`.
2. List the files that need to change.
3. Implement the smallest useful change that satisfies acceptance criteria.
4. Keep `src/app/page.tsx` as composition only.
5. Put invitation sections under `src/components/invitation`.
6. Put reusable components under `src/components/common`.
7. Put helpers under `src/lib`.
8. Avoid unnecessary client components.
9. Use accessible labels for buttons.
10. Handle empty or placeholder data gracefully.

## Validation

After editing, run when possible:

```bash
pnpm lint
pnpm build
```

If commands fail, fix the cause if it is inside the current ticket scope. If it is outside scope, report it clearly.

## Completion report

Report with:

```txt
완료 티켓: MW-XX
변경 파일:
- ...
검증:
- pnpm lint: pass/fail/not run
- pnpm build: pass/fail/not run
주의사항:
- ...
다음 추천 티켓:
- MW-YY
```


---

# File: `.agents/skills/mobile-wedding-review/SKILL.md`

---
name: mobile-wedding-review
description: Review mobile-wedding changes against the PRD, ticket scope, mobile UX, accessibility, and no-backend/no-database constraints. Use before committing or opening a PR.
---

# mobile-wedding review skill

Use this skill to review changes in the `mobile-wedding` project.

## Required context

Read:

1. `AGENTS.md`
2. `docs/PRD.md`
3. `docs/TICKETS.md`
4. `docs/QA_CHECKLIST.md`

## Review checklist

Check for:

1. Ticket scope compliance
2. Accidental Spring Boot/backend/API/DB additions
3. Unapproved production dependencies
4. Mobile layout risks at 360px, 390px, 430px
5. Accessibility issues
6. TypeScript type issues
7. Build/lint failures
8. Public exposure of real phone numbers, account numbers, API keys, or other sensitive data
9. Overly complex components
10. Inconsistent use of `src/data/wedding.ts`

## Review output

Do not modify files unless the user asks you to fix issues.

Return:

```txt
리뷰 결과: pass/fail
심각도 High:
- ...
심각도 Medium:
- ...
심각도 Low:
- ...
권장 수정 순서:
1. ...
2. ...
검증 필요 명령:
- pnpm lint
- pnpm build
```
