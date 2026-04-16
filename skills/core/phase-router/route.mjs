export function nextPhase(s = {}) {
  if (!s.hasSpec) return "brainstorm";
  if (!s.hasPlan) return "plan";
  if (!s.progressComplete) return "build";
  if (!s.reviewed) return "review";
  if (!s.shipped) return "ship";
  return "compound";
}
