# PRD Result Workspace Redesign

## Context

Area `PRD siap dipakai` saat ini masih terasa seperti card biasa. Ini bikin hasil akhir kurang terasa penting, dan markdown PRD terlihat mentah ketika model mengeluarkan tabel atau separator yang padat.

## Goals

- Ubah hasil akhir menjadi workspace dokumen yang lebih editorial dan premium.
- Perbaiki renderer markdown agar tabel, hr, blockquote, dan code block tampil rapi.
- Kurangi kemungkinan output markdown yang sulit dibaca lewat prompt yang lebih diarahkan.

## Design Direction

- Gunakan layout dua lapis: control strip di atas, document viewer besar di bawah.
- Viewer PRD harus terasa seperti lembar dokumen gelap yang fokus ke readability, bukan area textarea.
- Panel revisi tetap berada dalam satu workspace yang sama agar tidak terasa seperti card terpisah.
- Actions utama tetap tersedia, tetapi chrome dibuat lebih tenang dan tertata.

## Implementation Notes

- `components/wizard/step-prd-result.tsx`
  - Ubah struktur menjadi document workspace.
  - Tambahkan metadata ringkas seperti status hasil, format markdown, dan readiness.
  - Integrasikan panel revisi ke dalam workspace utama.
- `components/common/markdown-preview.tsx`
  - Tambahkan dukungan GFM dengan `remark-gfm`.
  - Gunakan renderer custom untuk table, hr, code, dan blockquote.
- `app/globals.css`
  - Tambahkan utility class untuk document chrome dan markdown viewer.
- `lib/prompts.ts`
  - Arahkan AI untuk lebih memilih subheading, bullet list, dan tabel hanya saat benar-benar membantu.

## Verification

- Component test untuk memastikan GFM table benar-benar dirender sebagai tabel HTML.
- Component test untuk memastikan `StepPrdResult` menampilkan metadata workspace dan panel revisi terintegrasi.
- `npm test`
- `npm run lint`
- `npm run build`
- Browser verification pada halaman hasil PRD.
