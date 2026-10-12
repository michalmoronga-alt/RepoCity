import { ArrowRight, RotateCcw } from "lucide-react";
import type { Step } from "../data/simulation";
export default function SimulationBar({
  steps,
  index,
  onNext,
  onReset,
}: {
  steps: Step[];
  index: number;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <footer className="simulation-bar">
      <div className="simulation-title">
        <h2>Simulácia zmien</h2>
        <span>
          {index + 1} / {steps.length}
        </span>
      </div>
      <div className="simulation-step" aria-live="polite">
        <strong>{steps[index].label}</strong>
        <p>{steps[index].detail}</p>
      </div>
      <div className="simulation-actions">
        <button className="button" onClick={onReset} disabled={index === 0}>
          <RotateCcw size={16} />
          Od začiatku
        </button>
        <button
          className="button primary"
          onClick={onNext}
          disabled={index === steps.length - 1}
        >
          {index === steps.length - 1 ? "Koniec ukážky" : "Ďalší krok"}
          <ArrowRight size={16} />
        </button>
      </div>
    </footer>
  );
}
