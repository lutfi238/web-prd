# PRD Result Workspace Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mengubah area hasil PRD menjadi document workspace yang lebih premium dan memperbaiki rendering markdown agar hasil AI mudah dibaca.

**Architecture:** Result view tetap client-side, tetapi UI-nya dipecah menjadi control strip, document viewer, dan revision dock dalam satu workspace. Renderer markdown ditingkatkan dengan GFM dan komponen render custom agar tabel dan struktur PRD tampil rapi tanpa mengubah flow wizard yang sudah ada.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS, react-markdown, remark-gfm, Vitest, Testing Library

---

### Task 1: Document the redesign

**Files:**
- Create: `docs/plans/2026-03-27-prd-result-redesign-design.md`
- Create: `docs/plans/2026-03-27-prd-result-redesign.md`

**Step 1: Write the design notes**

Ringkas masalah, tujuan, arah visual, dan file yang perlu diubah.

**Step 2: Save the implementation plan**

Tuliskan urutan TDD, file test, file implementasi, dan command verifikasi.

### Task 2: Add failing tests for the result workspace

**Files:**
- Create: `tests/components/markdown-preview.test.tsx`
- Create: `tests/components/step-prd-result.test.tsx`

**Step 1: Write the failing markdown test**

Verifikasi markdown tabel GFM dirender sebagai `<table>` dan bukan sekadar paragraf mentah.

**Step 2: Write the failing result workspace test**

Verifikasi `StepPrdResult` menampilkan metadata workspace dan panel revisi yang bisa dibuka di area yang sama.

**Step 3: Run focused tests to verify failure**

Run: `npm test -- markdown-preview step-prd-result`

Expected: FAIL karena renderer dan layout lama belum mendukung perilaku baru.

### Task 3: Implement the markdown viewer upgrade

**Files:**
- Modify: `package.json`
- Modify: `components/common/markdown-preview.tsx`
- Modify: `app/globals.css`

**Step 1: Add the required dependency**

Pasang `remark-gfm` agar tabel, checklist, dan formatting GFM bisa diparse.

**Step 2: Write the minimal implementation**

Tambahkan `remarkPlugins`, renderer table/code/hr/blockquote, dan utility class untuk viewer dokumen.

**Step 3: Run the markdown component test**

Run: `npm test -- markdown-preview`

Expected: PASS

### Task 4: Implement the result workspace redesign

**Files:**
- Modify: `components/wizard/step-prd-result.tsx`
- Modify: `app/globals.css`
- Modify: `lib/prompts.ts`

**Step 1: Reshape the layout**

Bangun control strip, metadata chips, action cluster, document viewer, dan revision dock dalam satu workspace.

**Step 2: Improve output guidance**

Perbarui prompt PRD agar AI lebih memilih subheading, bullet list, dan tabel hanya bila benar-benar membantu.

**Step 3: Run the result workspace test**

Run: `npm test -- step-prd-result`

Expected: PASS

### Task 5: Full verification

**Files:**
- Verify only

**Step 1: Run automated checks**

Run:
- `npm test`
- `npm run lint`
- `npm run build`

Expected: semua lulus

**Step 2: Run browser verification**

Start dev server, buka halaman hasil PRD, dan pastikan viewer baru terasa lebih rapi, action tetap bekerja, dan panel revisi menyatu dengan workspace.

### Task 6: Update persistent context

**Files:**
- Update Obsidian note: `C:/Users/LutFi/OneDrive/Documents/Obsidian Vault/Codex-Context/web-ngodingpakeai-clone/2026-03-27-prd-generator-personal.md`

**Step 1: Append the redesign summary**

Catat keputusan visual, file yang diubah, hasil verifikasi, dan bahwa renderer markdown sekarang mendukung GFM lebih baik.
