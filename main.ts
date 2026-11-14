// makefun-coin-launch-01 entry (Node 22, standard library only).
//
// The coin itself is launched by the agent on pump.fun; this program only
// hands in the result. It copies LAUNCH.json from the repository root into
// the output directory, where the grader reads it. Nothing else happens
// here: no network, no clock, no files outside the repository, so two runs
// always write the same bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LAUNCH_FILE = "LAUNCH.json";

mkdirSync(OUTPUT_DIR, { recursive: true });

const source = join(BOT_DIR, LAUNCH_FILE);
const target = join(OUTPUT_DIR, LAUNCH_FILE);

try {
  copyFileSync(source, target);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`could not copy ${LAUNCH_FILE} from ${BOT_DIR}: ${message}`);
  process.exit(1);
}

// Read back what was written and confirm it is a launch file: a JSON
// object with the two string fields the gate looks for. This only checks
// shape, never values, so the placeholders still run locally and the real
// mint and signature pass unchanged. A file that is not JSON, or that is
// missing a field, fails here instead of failing silently at grading time.
try {
  const parsed = JSON.parse(readFileSync(target, "utf8")) as unknown;
  const ok =
    typeof parsed === "object" &&
    parsed !== null &&
    typeof (parsed as Record<string, unknown>).mint === "string" &&
    typeof (parsed as Record<string, unknown>).create_signature === "string";
  if (!ok) {
    throw new Error(`${LAUNCH_FILE} is not an object with string mint and create_signature fields`);
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`copied ${LAUNCH_FILE} failed its read-back check: ${message}`);
  process.exit(1);
}
