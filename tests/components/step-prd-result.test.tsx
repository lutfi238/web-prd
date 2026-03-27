import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StepPrdResult } from "@/components/wizard/step-prd-result";

const sampleMarkdown = [
  "# PRD",
  "",
  "## Project Overview & Goals",
  "",
  "- Membantu founder menulis PRD lebih cepat.",
].join("\n");

describe("StepPrdResult", () => {
  it("shows document workspace metadata and inline revision dock", async () => {
    const user = userEvent.setup();

    render(
      <StepPrdResult
        markdown={sampleMarkdown}
        isGenerating={false}
        isRevising={false}
        onCopy={vi.fn()}
        onDownload={vi.fn()}
        onRevise={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Workspace dokumen")).toHaveLength(2);
    expect(screen.getByRole("region", { name: "Dokumen PRD" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Revisi PRD" }));

    expect(screen.getByText("Catatan revisi untuk versi berikutnya")).toBeInTheDocument();
  });
});
