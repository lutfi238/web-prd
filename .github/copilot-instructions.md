# Project Guidelines

## Architecture
- This is a Next.js 15 App Router app for generating Indonesian PRDs with a 4-step wizard.
- Keep client wizard flow in `components/wizard/*` and persisted state in `store/prd-wizard-store.ts`.
- Keep AI orchestration in API routes: `app/api/questions/route.ts` and `app/api/prd/route.ts`.
- Shared request/response contracts live in `lib/schemas.ts` and matching types in `types/*.ts`.
- Reusable UI primitives belong in `components/ui/*`; shared presentation helpers belong in `components/common/*`.

## Code Style
- Use TypeScript strictly and preserve existing `@/` imports.
- Follow existing React patterns: mark interactive components with `"use client"` and keep components focused.
- Match the current UX language: user-facing labels, helper text, and errors should stay in Indonesian unless a file already uses another language.
- Prefer existing utilities and defaults before introducing new abstractions.

## Build and Test
- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Validate changes with `npm run lint`, `npm test`, and `npm run build` when your work can affect production behavior.
- Lint runs with `--max-warnings=0`; do not leave warnings behind.

## Conventions
- Provider configuration is browser-local and persisted in localStorage; do not move API keys into server defaults unless explicitly requested.
- Zustand store persistence and step transitions are centralized in `store/prd-wizard-store.ts`; extend store actions instead of duplicating wizard state in components.
- Validate external inputs with Zod schemas in `lib/schemas.ts` before processing.
- Keep API route error responses normalized and user-friendly.
- Follow the existing test layout under `tests/`, mirroring source areas and using Vitest + Testing Library patterns.

## Reference Docs
- See `README.md` for setup, scripts, and product overview.
- See `docs/plans/2026-03-27-prd-generator-personal.md` for the original implementation plan.
- See `docs/plans/2026-03-27-prd-generator-personal-design.md` for UI/design intent.
- See `docs/plans/2026-03-27-question-followup.md` and `docs/plans/2026-03-27-prd-result-redesign.md` for later feature-specific context.
