"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Step1UrlInput } from "@/components/wizard/Step1UrlInput";
import { Step2MetadataForm } from "@/components/wizard/Step2MetadataForm";
import { Step3Progress } from "@/components/wizard/Step3Progress";
import { Step4Result } from "@/components/wizard/Step4Result";
import { StepIndicator } from "@/components/wizard/StepIndicator";
import { useWizard } from "@/lib/store";

export function WizardContainer() {
  const step = useWizard((state) => state.step);
  const video = useWizard((state) => state.video);
  const draft = useWizard((state) => state.metadata);
  const jobId = useWizard((state) => state.jobId);
  const jobStartedAt = useWizard((state) => state.jobStartedAt);
  const result = useWizard((state) => state.result);
  const previousStep = useRef(step);
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    container.current?.querySelector<HTMLElement>("#wizard-heading")?.focus();
  }, [step]);

  return (
    <section className="wizard" ref={container} aria-labelledby="wizard-heading">
      <StepIndicator step={step} />
      <Card className="wizard-card">
        <div className="wizard-step" key={step}>
          {step === 1 && <Step1UrlInput />}
          {step === 2 && video && draft && <Step2MetadataForm video={video} draft={draft} />}
          {step === 3 && jobId && <Step3Progress key={jobId} jobId={jobId} startedAt={jobStartedAt} />}
          {step === 4 && result && <Step4Result result={result} />}
        </div>
      </Card>
    </section>
  );
}
