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
