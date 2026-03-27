# PRD Generator Personal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-stack personal PRD generator with a four-step wizard, multi-provider AI settings, persisted browser state, and markdown PRD generation/revision.

**Architecture:** Use Next.js 15 App Router for the app shell and API routes, Zustand for persisted client state, React Hook Form + Zod for user inputs, and Vercel AI SDK as the unified generation layer across Groq and OpenAI-compatible providers. Keep the wizard UX on the client while centralizing prompting and AI response normalization in server route handlers.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Zustand, React Hook Form, Zod, Vercel AI SDK, Vitest, Testing Library, react-markdown, sonner, lucide-react

---

### Task 1: Scaffold the project foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `components.json`
- Create: `.gitignore`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `next-env.d.ts`

**Step 1: Write the failing test**

Create a smoke test that imports a future helper from `lib/utils.ts` and expects the module to exist.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/utils.test.ts`
Expected: FAIL because the project files do not exist yet.

**Step 3: Write minimal implementation**

Add the base project config and the minimum utility module needed for the smoke test to compile.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/utils.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 2: Define shared types, defaults, and schemas

**Files:**
- Create: `types/provider.ts`
- Create: `types/prd.ts`
- Create: `lib/provider-defaults.ts`
- Create: `lib/schemas.ts`
- Test: `tests/lib/schemas.test.ts`

**Step 1: Write the failing test**

Write tests covering:
- provider config validation
- question schema validation
- PRD request validation

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/schemas.test.ts`
Expected: FAIL because schemas are not implemented.

**Step 3: Write minimal implementation**

Add shared TypeScript types and Zod schemas that satisfy the tests.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/schemas.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 3: Build AI provider adapter and prompt layer

**Files:**
- Create: `lib/ai-providers.ts`
- Create: `lib/prompts.ts`
- Test: `tests/lib/ai-providers.test.ts`

**Step 1: Write the failing test**

Write tests covering:
- Groq model resolution
- OpenRouter resolution via compatible provider
- custom OpenAI-compatible resolution
- thrown error for unsupported provider

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/ai-providers.test.ts`
Expected: FAIL because adapter functions do not exist.

**Step 3: Write minimal implementation**

Implement adapter helpers and prompt builders.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/ai-providers.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 4: Implement AI route handlers

**Files:**
- Create: `app/api/questions/route.ts`
- Create: `app/api/prd/route.ts`
- Test: `tests/app/api/questions.test.ts`
- Test: `tests/app/api/prd.test.ts`

**Step 1: Write the failing test**

Write route tests covering:
- invalid payload returns `400`
- valid request calls AI generator helper
- malformed model output returns normalized server error

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/app/api/questions.test.ts tests/app/api/prd.test.ts`
Expected: FAIL because route handlers do not exist.

**Step 3: Write minimal implementation**

Create route handlers with request validation, provider resolution, prompt generation, AI call orchestration, and JSON responses.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/app/api/questions.test.ts tests/app/api/prd.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 5: Implement persisted wizard store

**Files:**
- Create: `store/prd-wizard-store.ts`
- Test: `tests/store/prd-wizard-store.test.ts`

**Step 1: Write the failing test**

Write tests covering:
- step transitions
- answer updates
- provider updates
- reset behavior

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/store/prd-wizard-store.test.ts`
Expected: FAIL because the store does not exist.

**Step 3: Write minimal implementation**

Implement the Zustand store with persist-safe state and actions.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/store/prd-wizard-store.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 6: Create shadcn-aligned UI primitives and app shell

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `components/ui/*.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `components/common/loading-panel.tsx`
- Create: `components/common/markdown-preview.tsx`
- Create: `components/common/app-footer.tsx`

**Step 1: Write the failing test**

Write a rendering test for `AppShell` that expects the shell title and children slot to render.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/app-shell.test.tsx`
Expected: FAIL because the shell does not exist.

**Step 3: Write minimal implementation**

Create the shell, theme tokens, and required UI primitives.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/app-shell.test.tsx`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 7: Build provider settings dialog

**Files:**
- Create: `components/settings/provider-settings-dialog.tsx`
- Create: `components/settings/provider-form.tsx`
- Test: `tests/components/provider-settings-dialog.test.tsx`

**Step 1: Write the failing test**

Write tests covering:
- provider switching
- field validation
- save action updates store

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/provider-settings-dialog.test.tsx`
Expected: FAIL because the dialog does not exist.

**Step 3: Write minimal implementation**

Build the settings dialog and connect it to the store.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/provider-settings-dialog.test.tsx`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 8: Build wizard step components

**Files:**
- Create: `components/wizard/progress-header.tsx`
- Create: `components/wizard/step-idea.tsx`
- Create: `components/wizard/step-tech-preference.tsx`
- Create: `components/wizard/question-card.tsx`
- Create: `components/wizard/step-questions.tsx`
- Create: `components/wizard/step-prd-result.tsx`
- Create: `app/page.tsx`
- Test: `tests/components/wizard-flow.test.tsx`

**Step 1: Write the failing test**

Write an end-to-end component test for the client wizard flow:
- enter idea
- move to tech preference
- select a mode
- show question state

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/wizard-flow.test.tsx`
Expected: FAIL because the wizard components do not exist.

**Step 3: Write minimal implementation**

Implement the wizard components and client orchestration.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/wizard-flow.test.tsx`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 9: Wire server calls, result actions, and revision flow

**Files:**
- Modify: `components/wizard/step-questions.tsx`
- Modify: `components/wizard/step-prd-result.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/prd-result.test.tsx`

**Step 1: Write the failing test**

Write tests covering:
- generate button disabled/enabled states
- copy action
- download action
- revision submit action calling the correct route helper

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/prd-result.test.tsx`
Expected: FAIL because the behavior is not implemented.

**Step 3: Write minimal implementation**

Add fetch orchestration, loading states, copy/download helpers, and revision UX.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/prd-result.test.tsx`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 10: Write docs and final verification

**Files:**
- Create: `README.md`

**Step 1: Write the failing test**

No automated test required for README. Instead create a verification checklist.

**Step 2: Run verification commands**

Run:
- `npm test`
- `npm run lint`
- `npm run build`

Expected:
- tests pass
- lint passes
- production build succeeds

**Step 3: Write minimal implementation**

Document install, local run, provider setup, and deployment instructions in `README.md`.

**Step 4: Run verification again**

Run:
- `npm test`
- `npm run lint`
- `npm run build`

Expected:
- all commands succeed after docs and final code are in place

**Step 5: Commit**

Skip because the workspace is not a git repository.
