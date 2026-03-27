import { beforeEach, describe, expect, it } from "vitest";

import { getActiveProviderConfig, usePrdWizardStore } from "@/store/prd-wizard-store";

describe("usePrdWizardStore", () => {
  beforeEach(() => {
    usePrdWizardStore.setState(usePrdWizardStore.getInitialState());
    localStorage.clear();
  });

  it("moves forward and backward between wizard steps", () => {
    usePrdWizardStore.getState().nextStep();
    usePrdWizardStore.getState().nextStep();
    expect(usePrdWizardStore.getState().step).toBe(3);

    usePrdWizardStore.getState().previousStep();
    expect(usePrdWizardStore.getState().step).toBe(2);
  });

  it("upserts and removes answers", () => {
    usePrdWizardStore.getState().upsertAnswer({
      questionId: "q-1",
      value: "Founder solo",
    });
    expect(usePrdWizardStore.getState().answers).toEqual([
      { questionId: "q-1", value: "Founder solo", followupValue: "" },
    ]);

    usePrdWizardStore.getState().skipQuestion("q-1");
    expect(usePrdWizardStore.getState().answers).toHaveLength(0);
  });

  it("updates provider settings and reads the active provider", () => {
    usePrdWizardStore.getState().setActiveProvider("openrouter");
    usePrdWizardStore.getState().updateProviderConfig("openrouter", {
      kind: "openrouter",
      apiKey: "or-key",
      model: "meta-llama/llama-3.3-70b-instruct",
      baseUrl: "https://openrouter.ai/api/v1",
    });

    const config = getActiveProviderConfig(usePrdWizardStore.getState());

    expect(config.kind).toBe("openrouter");
    expect(config.apiKey).toBe("or-key");
  });

  it("resets wizard data but keeps provider settings", () => {
    usePrdWizardStore.getState().setIdea("PRD app");
    usePrdWizardStore.getState().setActiveProvider("openrouter");
    usePrdWizardStore.getState().updateProviderConfig("openrouter", {
      kind: "openrouter",
      apiKey: "or-key",
      model: "meta-llama/llama-3.3-70b-instruct",
      baseUrl: "https://openrouter.ai/api/v1",
    });

    usePrdWizardStore.getState().resetWizard();

    expect(usePrdWizardStore.getState().idea).toBe("");
    expect(usePrdWizardStore.getState().activeProvider).toBe("openrouter");
    expect(usePrdWizardStore.getState().providers.openrouter.apiKey).toBe("or-key");
  });
});
