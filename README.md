# PRD Generator Personal

Clone pribadi untuk workflow "Bikin PRD" berbasis Next.js 15, Tailwind, shadcn/ui, Zustand, dan Vercel AI SDK. Aplikasi ini membantu kamu mengubah ide produk menjadi PRD markdown profesional dalam bahasa Indonesia dengan wizard 4 langkah dan dukungan multi-provider AI.

## Fitur

- Wizard 4 step: ide produk, preferensi teknologi, pertanyaan dinamis, hasil PRD
- Multi-provider AI:
  - Groq
  - OpenRouter
  - OpenAI-compatible custom
- API key dan setting model disimpan lokal di browser
- State wizard persisten saat refresh
- Output markdown lengkap dengan tombol copy, download, dan revisi PRD
- Dark theme modern dengan aksen orange
- Responsive mobile-first

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Vercel AI SDK
- Zustand
- React Hook Form + Zod
- react-markdown
- sonner
- Vitest + Testing Library

## Jalankan Lokal

```bash
npm install
npm run dev
```

Lalu buka:

```bash
http://localhost:3000
```

## Setup Provider AI

1. Klik tombol `Pengaturan AI` di kanan atas.
2. Pilih provider yang ingin dipakai.
3. Isi:
   - `API Key`
   - `Model`
   - `Base URL` untuk OpenRouter atau provider compatible
4. Klik `Simpan Provider`.

Catatan:
- Semua setting disimpan di `localStorage`.
- Tidak ada autentikasi.
- Cocok untuk personal use di browser sendiri.

## Provider yang Didukung

### Groq

- Contoh model default: `llama-3.3-70b-versatile`

### OpenRouter

- Contoh model default: `meta-llama/llama-3.3-70b-instruct`
- Base URL default: `https://openrouter.ai/api/v1`

### OpenAI-Compatible

- Bisa dipakai untuk gateway atau provider custom yang kompatibel dengan OpenAI API.
- Isi nama provider, model, base URL, dan API key secara manual.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
```

## Struktur Folder

```text
app/
components/
hooks/
lib/
store/
tests/
types/
docs/plans/
```

## Deploy ke Vercel

1. Push project ke repository Git.
2. Import project di Vercel.
3. Deploy seperti aplikasi Next.js biasa.

Karena API key disimpan lokal di browser, kamu tidak wajib menyetel secret provider di Vercel untuk personal use.

## Pengujian

```bash
npm test
npm run lint
npm run build
```

## Catatan Implementasi

- Prompting dan validasi AI terpusat di route handler:
  - `app/api/questions/route.ts`
  - `app/api/prd/route.ts`
- Wizard state dan provider config tersimpan di Zustand + persist.
- UI dirancang agar nyaman dipakai untuk founder solo, PM, atau builder yang ingin menyusun PRD cepat.
