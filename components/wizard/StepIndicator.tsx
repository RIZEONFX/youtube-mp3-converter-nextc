import { Check } from "lucide-react";

const labels = ["Link Video", "Metadata", "Proses", "Download"];

export function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="step-indicator" aria-label="Tahapan konversi">
      {labels.map((label, index) => {
        const number = index + 1;
        const state = step > number ? "completed" : step === number ? "active" : "upcoming";
        return (
          <li key={label} data-state={state} aria-current={state === "active" ? "step" : undefined}>
            <span className="step-number" aria-hidden="true">{state === "completed" ? <Check size={13} /> : number}</span>
            <span className="step-label">{label}</span>
            {state === "completed" && <span className="sr-only"> (selesai)</span>}
          </li>
        );
      })}
    </ol>
  );
}
