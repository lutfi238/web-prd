import type { QuestionAnswer, QuestionsRequest, GeneratePrdRequest } from "@/types/prd";

function formatAnswer(answer: QuestionAnswer) {
  if (answer.followupValue?.trim()) {
    return `${answer.value} — ${answer.followupValue.trim()}`;
  }

  return answer.value;
}

function formatAnswers(input: GeneratePrdRequest) {
  if (input.answers.length === 0) {
    return "- Belum ada jawaban tambahan.";
  }

  return input.answers
    .map((answer) => `- ${answer.questionId}: ${formatAnswer(answer)}`)
    .join("\n");
}

export function buildQuestionsPrompt(input: QuestionsRequest) {
  const stackDirection =
    input.techPreference === "custom" && input.customTechNotes
      ? `Gunakan preferensi stack berikut sebagai constraint tambahan: ${input.customTechNotes}.`
      : "Kamu bebas merekomendasikan stack yang paling cocok.";

  return {
    system: [
      "Kamu adalah product strategist dan technical writer senior.",
      "Tugasmu menyusun pertanyaan klarifikasi untuk membantu AI menulis PRD produk SaaS dengan bahasa Indonesia yang jelas.",
      "Balas HANYA dalam JSON valid.",
      'Format wajib: {"questions":[{"id":"q-1","prompt":"...","helperText":"...","type":"choice","options":[{"id":"opsi-1","label":"..."},{"id":"opsi-2","label":"...","followup":{"label":"Catatan tambahan","placeholder":"Tulis detail tambahan..."}}],"skippable":true}]}',
      "Buat 6 sampai 8 pertanyaan total.",
      "Campurkan pertanyaan pilihan dan teks.",
      "Pertanyaan harus praktis, spesifik, dan membantu menyusun PRD profesional.",
      "Jika ada opsi yang seharusnya membuka kolom detail tambahan, kamu boleh menambahkan properti followup pada opsi itu.",
    ].join(" "),
    prompt: [
      `Ide aplikasi: ${input.idea}`,
      `Mode preferensi teknologi: ${input.techPreference}`,
      stackDirection,
      "Gunakan bahasa Indonesia yang natural.",
      "Pastikan opsi jawaban singkat, mudah dipilih, dan cocok untuk wizard UI.",
      "Pertanyaan terakhir idealnya berupa input teks singkat agar user bisa memberi catatan tambahan.",
    ].join("\n"),
  };
}

export function buildPrdPrompt(input: GeneratePrdRequest) {
  const stackDirection =
    input.techPreference === "custom" && input.customTechNotes
      ? `Preferensi teknologi user: ${input.customTechNotes}`
      : "Teknologi boleh direkomendasikan AI sesuai kebutuhan produk.";

  return {
    system: [
      "Kamu adalah senior product manager, solusi architect, dan technical writer.",
      "Tulis PRD lengkap dalam bahasa Indonesia.",
      "Balas hanya markdown.",
      "PRD harus profesional, rinci, actionable, dan cocok untuk tim engineer atau founder.",
      "Utamakan subheading pendek, bullet list, dan paragraf yang padat tetapi mudah dipindai.",
      "Gunakan tabel markdown hanya jika benar-benar membantu membandingkan opsi atau merangkum data terstruktur.",
      "Hindari HTML seperti <br>, <table>, atau tag lain di dalam jawaban.",
      "Gunakan heading markdown dan section wajib berikut:",
      "Project Overview & Goals",
      "Target User & Persona",
      "Features & User Stories",
      "Tech Stack Recommendation",
      "Non-Functional Requirements",
      "Database Schema (jika relevan)",
      "Scope & Out of Scope",
      "Risks & Assumptions",
      "Estimated Timeline",
    ].join(" "),
    prompt: [
      `Ide aplikasi: ${input.idea}`,
      stackDirection,
      "Jawaban user:",
      formatAnswers(input),
      "Jika ada detail yang belum jelas, buat asumsi yang masuk akal dan tandai sebagai asumsi.",
      "Utamakan struktur yang tajam, detail implementatif, dan tetap mudah dibaca.",
      "Untuk persona, features, dan scope, prioritaskan bullet list atau subheading daripada tabel lebar.",
    ].join("\n"),
  };
}

export function buildRevisionPrompt(input: GeneratePrdRequest) {
  return {
    system: [
      "Kamu adalah senior product manager dan technical writer.",
      "Revisi PRD markdown yang sudah ada tanpa menghilangkan struktur utamanya.",
      "Balas hanya markdown.",
      "Pastikan hasil revisi tetap lengkap, koheren, dan profesional dalam bahasa Indonesia.",
      "Pertahankan format yang nyaman dibaca: subheading jelas, bullet list rapi, dan hindari HTML seperti <br>.",
    ].join(" "),
    prompt: [
      "PRD saat ini:",
      input.existingPrd ?? "",
      "",
      `Permintaan revisi: ${input.revisionNote ?? ""}`,
      "",
      "Jika revisi mengubah asumsi atau scope, perbarui section yang relevan secara konsisten.",
    ].join("\n"),
  };
}
