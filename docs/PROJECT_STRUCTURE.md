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
