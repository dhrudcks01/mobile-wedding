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
