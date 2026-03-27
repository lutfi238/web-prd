import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuestionCard } from "@/components/wizard/question-card";
import type { GeneratedQuestion, QuestionAnswer } from "@/types/prd";

const question: GeneratedQuestion = {
  id: "q-output-style",
  prompt: "Mau output seperti apa?",
  type: "choice",
  options: [
    {
      id: "narrative",
      label: "Teks Narasi",
    },
    {
      id: "notes",
      label: "Sebutkan di catatan tambahan",
      followup: {
        label: "Catatan tambahan",
        placeholder: "Tulis gaya output yang kamu mau...",
      },
    },
  ],
};

describe("QuestionCard", () => {
  it("reveals and clears the follow-up field based on selected option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSkip = vi.fn();

    function Harness() {
      const [answer, setAnswer] = React.useState<QuestionAnswer | undefined>(undefined);

      return (
        <QuestionCard
          question={question}
          index={0}
          answer={answer}
          onChange={(nextAnswer) => {
            setAnswer(nextAnswer);
            onChange(nextAnswer);
          }}
          onSkip={onSkip}
        />
      );
    }

    render(<Harness />);

    const triggerOption = screen.getByRole("radio", { name: "Sebutkan di catatan tambahan" });
    await user.click(triggerOption);

    expect(onChange).toHaveBeenLastCalledWith({
      questionId: "q-output-style",
      value: "Sebutkan di catatan tambahan",
      optionId: "notes",
      followupValue: "",
    });

    const followupField = screen.getByLabelText("Catatan tambahan");
    await user.type(followupField, "Tolong gaya bahasanya lebih tegas");

    expect(onChange).toHaveBeenLastCalledWith({
      questionId: "q-output-style",
      value: "Sebutkan di catatan tambahan",
      optionId: "notes",
      followupValue: "Tolong gaya bahasanya lebih tegas",
    });

    await user.click(screen.getByRole("radio", { name: "Teks Narasi" }));

    expect(onChange).toHaveBeenLastCalledWith({
      questionId: "q-output-style",
      value: "Teks Narasi",
      optionId: "narrative",
      followupValue: "",
    });

    await waitFor(() => {
      expect(screen.queryByLabelText("Catatan tambahan")).not.toBeInTheDocument();
    });
  });
});
