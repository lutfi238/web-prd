# Question Follow-up Input Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add smooth follow-up input behavior for choice options like `Sebutkan di catatan tambahan` so the extra field appears and disappears based on the selected option.

**Architecture:** Extend question option and answer schemas with optional follow-up metadata, add a small helper module to infer and format follow-up behavior, and update the question card to render an animated follow-up textarea only when needed. Keep persisted state backward compatible by treating new fields as optional.

**Tech Stack:** Next.js 15, React 19, TypeScript, Zustand, Zod, Vitest, Testing Library, Tailwind CSS

---

### Task 1: Extend schema and helper contracts

**Files:**
- Modify: `types/prd.ts`
- Modify: `lib/schemas.ts`
- Create: `lib/question-answers.ts`
- Test: `tests/lib/question-answers.test.ts`
- Modify: `tests/lib/schemas.test.ts`

**Step 1: Write the failing test**

Add tests for:
- question options with follow-up metadata
- keyword-based follow-up inference
- answer completeness when follow-up is required

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/question-answers.test.ts tests/lib/schemas.test.ts`
Expected: FAIL because helper functions and schema fields do not exist yet.

**Step 3: Write minimal implementation**

Add optional follow-up fields to types and schema, then implement helper functions for:
- detecting follow-up options
- deriving selected choice state
- checking answer completeness

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/question-answers.test.ts tests/lib/schemas.test.ts`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 2: Update prompts and question UI

**Files:**
- Modify: `lib/prompts.ts`
- Modify: `components/wizard/question-card.tsx`
- Modify: `components/wizard/step-questions.tsx`
- Test: `tests/components/question-card.test.tsx`

**Step 1: Write the failing test**

Add a component test covering:
- follow-up textarea appears when trigger option is selected
- follow-up textarea updates answer payload
- follow-up textarea becomes hidden and clears extra value when another option is selected

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/question-card.test.tsx`
Expected: FAIL because the component does not yet support follow-up behavior.

**Step 3: Write minimal implementation**

Update the prompt format, wire the question card to structured answers, and animate the follow-up input with CSS transitions.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/question-card.test.tsx`
Expected: PASS

**Step 5: Commit**

Skip because the workspace is not a git repository.

### Task 3: Final verification

**Files:**
- Modify: `components/wizard/prd-generator-app.tsx` if needed for typing adjustments

**Step 1: Run focused verification**

Run:
- `npm test`
- `npm run lint`
- `npm run build`

Expected:
- tests pass
- lint passes
- build passes

**Step 2: Browser verify**

Start dev server and confirm:
- wizard still loads
- selecting a follow-up option reveals the extra field
- switching away hides the field again

**Step 3: Commit**

Skip because the workspace is not a git repository.
