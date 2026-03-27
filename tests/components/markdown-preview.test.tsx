import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownPreview } from "@/components/common/markdown-preview";

describe("MarkdownPreview", () => {
  it("renders GFM tables as accessible table markup", () => {
    render(
      <MarkdownPreview
        content={[
          "## Ringkasan",
          "",
          "| Kolom | Nilai |",
          "| --- | --- |",
          "| Target user | Founder solo |",
        ].join("\n")}
      />,
    );

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(within(table).getByRole("columnheader", { name: "Kolom" })).toBeInTheDocument();
    expect(within(table).getByRole("cell", { name: "Founder solo" })).toBeInTheDocument();
  });
});
