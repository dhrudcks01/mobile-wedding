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
