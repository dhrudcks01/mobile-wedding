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
