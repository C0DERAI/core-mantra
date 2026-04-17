export type Mode = "lite" | "standard" | "full";

export interface DetectModeInput {
  filesTouched?: number;
  locChanged?: number;
  newPublicApi?: boolean;
  newDeps?: number;
  override?: Mode | null;
}

const MODES: ReadonlySet<Mode> = new Set<Mode>(["lite", "standard", "full"]);

function isMode(value: unknown): value is Mode {
  return typeof value === "string" && MODES.has(value as Mode);
}

export function detectMode(input: DetectModeInput = {}): Mode {
  const {
    filesTouched = 0,
    locChanged = 0,
    newPublicApi = false,
    newDeps = 0,
    override = null,
  } = input;

  if (override !== null && isMode(override)) return override;
  if (newPublicApi || newDeps > 0) return "full";
  if (filesTouched <= 1 && locChanged <= 30) return "lite";
  if (filesTouched <= 3 && locChanged <= 200) return "standard";
  return "full";
}
