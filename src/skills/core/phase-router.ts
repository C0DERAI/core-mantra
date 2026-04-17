export type Phase =
  | "brainstorm"
  | "plan"
  | "build"
  | "review"
  | "ship"
  | "compound";

export interface PhaseSignals {
  hasSpec?: boolean;
  hasPlan?: boolean;
  progressComplete?: boolean;
  reviewed?: boolean;
  shipped?: boolean;
}

export function nextPhase(signals: PhaseSignals = {}): Phase {
  if (!signals.hasSpec) return "brainstorm";
  if (!signals.hasPlan) return "plan";
  if (!signals.progressComplete) return "build";
  if (!signals.reviewed) return "review";
  if (!signals.shipped) return "ship";
  return "compound";
}
