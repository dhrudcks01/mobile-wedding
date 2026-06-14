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
