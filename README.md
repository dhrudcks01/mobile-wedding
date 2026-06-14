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

## 핵심 원칙

작게 나누어 구현합니다. 한 번에 전체를 맡기지 말고, 티켓 하나씩 Codex에게 지시합니다.
