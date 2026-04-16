export function detectMode({
  filesTouched = 0,
  locChanged = 0,
  newPublicApi = false,
  newDeps = 0,
  override = null,
} = {}) {
  if (override && ["lite", "standard", "full"].includes(override)) return override;
  if (newPublicApi || newDeps > 0) return "full";
  if (filesTouched <= 1 && locChanged <= 30) return "lite";
  if (filesTouched <= 3 && locChanged <= 200) return "standard";
  return "full";
}
