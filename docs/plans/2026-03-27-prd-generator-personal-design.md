# PRD Generator Personal Design

## Summary

PRD Generator Personal adalah aplikasi full-stack personal-use berbasis Next.js 15 App Router untuk menghasilkan Product Requirements Document (PRD) dalam bahasa Indonesia dari ide produk sederhana. Aplikasi meniru alur "Bikin PRD" dari ngodingpakeai.com dengan wizard 4 langkah, dark theme modern, dan iterasi hasil PRD melalui revisi berbasis AI.

## Goals

- Menyediakan wizard yang terasa cepat, jelas, dan konsisten di desktop maupun mobile.
- Mendukung beberapa provider AI yang bisa dikonfigurasi penuh dari browser:
  - Groq
  - OpenRouter
  - OpenAI-compatible custom
- Menyimpan semua state wizard dan setting provider di browser agar tahan refresh.
- Menghasilkan PRD markdown yang rapi, lengkap, dan konsisten dalam bahasa Indonesia.
- Menyediakan aksi hasil yang praktis: copy, download markdown, dan revisi PRD.

## Non-Goals

- Tidak ada autentikasi.
- Tidak ada penyimpanan cloud atau histori lintas device.
- Tidak ada collaboration, sharing link, atau workspace multi-user.
- Tidak ada rich text editor untuk PRD; output tetap markdown render + raw markdown export.

## Product Flow

### Step 1 — Input Ide

- Satu textarea besar dengan placeholder `Ide aplikasi kamu apa? (bahasa Indonesia boleh)`.
- CTA utama `Lanjut ke Preferensi Teknologi`.
- Validasi: ide tidak boleh kosong.

### Step 2 — Preferensi Teknologi

- Judul dan subjudul mengikuti referensi.
- Dua pilihan utama:
  - `Biarkan AI pilih`
  - `Pilih sendiri`
- Jika user memilih `Pilih sendiri`, ditampilkan textarea singkat untuk constraint teknologi bebas.
- Setting provider AI tetap berada di dialog global, bukan di dalam step ini, agar flow wizard tidak berat.

### Step 3 — Beberapa Pertanyaan

- Pertanyaan dihasilkan AI berdasarkan:
  - ide user
  - pilihan preferensi teknologi
  - catatan stack kustom jika ada
- Jumlah target 6-8 pertanyaan.
- Tipe pertanyaan:
  - `choice`: pill options
  - `text`: input singkat / textarea kecil
- Tiap pertanyaan punya aksi `Lewati`.
- Progress step dihitung dari jawaban terisi dibanding total pertanyaan.
- CTA utama `Generate PRD Sekarang`.

### Step 4 — Generate PRD

- Saat generate, tampil loading state dengan spinner dan copy `AI sedang menyusun PRD profesional...`
- Hasil berupa markdown render dan tombol aksi:
  - `Download PRD Markdown`
  - `Copy ke Clipboard`
  - `Revisi PRD`
- Revisi PRD memakai panel chat mini satu arah:
  - input bebas revisi
  - hasil menggantikan PRD sebelumnya
  - tetap memakai provider aktif

## Visual Direction

### Visual Thesis

Produk harus terasa seperti tool AI premium yang fokus, tenang, dan tajam: ruang gelap luas, panel slate pekat, highlight orange hangat, tipografi tegas, dan motion halus yang menambah sense of progress tanpa terasa ramai.

### Layout Direction

- Mobile-first single-column layout.
- Desktop memakai centered shell dengan lebar terkontrol dan ruang kosong yang cukup.
- Hero/heading area dibuat ringan, bukan marketing landing page.
- Wizard steps tampil sebagai permukaan utama tunggal, bukan kumpulan card kecil yang saling bertabrakan.

### Colors

- Background utama: `#0f172a`
- Surface: variasi slate yang sedikit lebih terang
- Accent utama: `#f97316`
- Accent hover/glow: orange yang sedikit lebih terang
- Text primer: near-white
- Text sekunder: slate muted

### Motion

- Progress bar animate halus saat step berubah.
- Step container fade/slide kecil saat berpindah.
- Hover card pilihan stack diberi border-glow halus.
- Loading state memakai pulse/spinner terukur.

## Technical Architecture

### Framework & Rendering

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix primitives
- Client-driven wizard UI
- Server-side route handlers untuk orkestrasi AI

### State Management

- Zustand untuk state wizard dan setting provider
- `persist` middleware untuk menyimpan:
  - current step
  - ide produk
  - mode tech preference
  - custom stack note
  - generated questions
  - answers
  - generated PRD
  - provider settings
  - active provider

### Forms & Validation

- React Hook Form + Zod untuk:
  - Step 1 ide
  - Step 2 custom stack note
  - dialog setting provider
  - input revisi PRD
- Zod schema juga dipakai di route handlers untuk validasi payload.

### AI Layer

- Menggunakan Vercel AI SDK `generateText`.
- Provider routing:
  - Groq via `@ai-sdk/groq`
  - OpenRouter via OpenAI-compatible adapter dengan base URL OpenRouter
  - Custom provider via `createOpenAICompatible`
- Semua credential disimpan lokal dan dikirim bersama request ke route handler.
- Route handler membangun model instance dari payload yang tervalidasi.

### AI Endpoints

- `POST /api/questions`
  - input: ide, tech preference, custom stack, provider config
  - output: daftar pertanyaan terstruktur
- `POST /api/prd`
  - mode `generate` atau `revise`
  - input: ide, answers, tech preference, provider config, existing PRD opsional, revision note opsional
  - output: markdown PRD

### Structured Output Strategy

- Pertanyaan diminta dalam JSON ketat.
- Parsing memakai Zod + normalisasi ringan untuk menghadapi output model yang sedikit berantakan.
- PRD diminta sebagai markdown dengan section wajib:
  - Project Overview & Goals
  - Target User & Persona
  - Features & User Stories
  - Tech Stack Recommendation
  - Non-Functional Requirements
  - Database Schema (jika relevan)
  - Scope & Out of Scope
  - Risks & Assumptions
  - Estimated Timeline

## File Structure

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/api/questions/route.ts`
- `app/api/prd/route.ts`
- `components/layout/app-shell.tsx`
- `components/settings/provider-settings-dialog.tsx`
- `components/settings/provider-form.tsx`
- `components/wizard/progress-header.tsx`
- `components/wizard/step-idea.tsx`
- `components/wizard/step-tech-preference.tsx`
- `components/wizard/step-questions.tsx`
- `components/wizard/question-card.tsx`
- `components/wizard/step-prd-result.tsx`
- `components/common/loading-panel.tsx`
- `components/common/markdown-preview.tsx`
- `components/common/app-footer.tsx`
- `components/ui/*`
- `hooks/use-mounted.ts`
- `lib/ai-providers.ts`
- `lib/prompts.ts`
- `lib/provider-defaults.ts`
- `lib/schemas.ts`
- `lib/utils.ts`
- `store/prd-wizard-store.ts`
- `types/provider.ts`
- `types/prd.ts`
- `tests/lib/*.test.ts`
- `tests/app/api/*.test.ts`
- `README.md`

## Error Handling

- Client preflight validation sebelum call AI:
  - ide wajib ada
  - provider aktif wajib valid
  - model wajib terisi
  - base URL wajib valid untuk custom provider
- Route handler mengembalikan error JSON terstruktur.
- Toast berbahasa Indonesia untuk semua error utama.
- Jika generate pertanyaan gagal, user tetap berada di Step 2/3 dan bisa retry.
- Jika generate PRD gagal, jawaban tetap tersimpan.
- Jika revisi gagal, PRD sebelumnya tidak hilang.

## Testing Strategy

### Automated

- Unit test:
  - schema provider
  - schema pertanyaan
  - schema request generate PRD
  - parser / sanitizer respons AI
- API route test:
  - payload invalid
  - provider invalid
  - output normalize sukses
- Store test:
  - step transition
  - persist-safe serialization

### Manual

- Setup provider dari dialog
- Wizard flow 1 → 4
- Refresh page di setiap step
- Copy markdown
- Download markdown
- Revisi PRD
- Responsif mobile dan desktop

## Constraints

- Tidak ada server-side secret persistence.
- Semua API key berada di sisi user untuk personal-use.
- Aplikasi harus tetap bisa dijalankan lokal dengan `npm run dev`.
- Deploy target Vercel tanpa dependency backend eksternal.

## Risks

- Output model antar provider dapat bervariasi; perlu prompt dan parsing defensif.
- JSON structured output dari model non-deterministic; perlu fallback sanitization.
- Tanpa auth, seluruh data berbasis browser state; jika localStorage dihapus, data hilang.

## Decisions

- Provider settings berada di dialog global, bukan bagian dari wizard step.
- `Pilih sendiri` untuk stack memakai free-text constraint, bukan form kompleks.
- OpenRouter diperlakukan sebagai preset OpenAI-compatible dengan UX provider sendiri.
- Revisi PRD memakai overwrite hasil, bukan version history.
