# Question Follow-up Input Design

## Goal

Menambahkan perilaku follow-up input pada opsi pertanyaan pilihan tertentu, misalnya `Sebutkan di catatan tambahan`, sehingga input tambahan muncul dan menghilang dengan transisi halus sesuai opsi yang dipilih user.

## Decision

Pakai pendekatan hybrid:

- Opsi pertanyaan boleh membawa metadata `followup` eksplisit dari AI.
- Jika metadata belum ada, UI tetap bisa menginfer follow-up dari keyword label seperti `lainnya`, `catatan tambahan`, atau `sebutkan`.

## Data Shape

### QuestionOption

Tambahkan properti opsional:

- `followup.label`
- `followup.placeholder`

### QuestionAnswer

Tambahkan properti opsional:

- `optionId`
- `followupValue`

`value` tetap menyimpan jawaban utama yang dipilih user agar prompt dan persist state tetap sederhana.

## UX Behavior

- Saat user memilih opsi biasa, hanya pill yang aktif.
- Saat user memilih opsi yang butuh follow-up, textarea kecil muncul di bawah pilihan dengan animasi expand/collapse.
- Saat user pindah ke opsi lain, textarea collapse lalu nilai `followupValue` dibersihkan.
- Jika user refresh, pilihan utama dan follow-up value tetap bisa direstorasi dari store.

## Prompting

Prompt generate pertanyaan diperluas agar AI boleh mengembalikan metadata follow-up ketika suatu opsi memerlukan catatan tambahan.

## Testing

- Schema test untuk metadata follow-up.
- Utility test untuk inference dan completion logic.
- Component test untuk memastikan textarea follow-up muncul saat opsi trigger dipilih, dan hilang saat user pindah ke opsi lain.
