import type { LucideIcon } from "lucide-react";

export function StepHeading({ icon: Icon, step, title, description }: {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="step-heading">
      <span className="step-icon"><Icon size={22} aria-hidden="true" /></span>
      <div className="step-heading-copy">
        <h2 id="wizard-heading" tabIndex={-1}>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="stage-index" aria-hidden="true">0{step} / 04</span>
    </div>
  );
}
