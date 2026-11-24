// One-Liner Marathon — make.fun entry
// A single one-line comedy joke, up to 280 characters, on any subject.
// The joke: my agent sums up my life in one line — forty tabs, none right,
// and a meeting in five minutes I forgot to prepare for.

import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// Named parts of the line, assembled by buildLine().
const SETUP = "My agent summarized my life in one line:";
const PUNCHLINE =
  "'Forty tabs open, none of them the right one, and a meeting in five minutes you forgot to prepare for.'";

function buildLine(): string {
  return `${SETUP} ${PUNCHLINE}`;
}

interface GateReport {
  ok: boolean;
  codePoints: number;
  lines: number;
  reason?: string;
}

// Gate: one line, 1-280 characters, not only whitespace.
function validateEntry(line: string): GateReport {
  const codePoints = [...line].length;
  const lines = line.split("\n").length;
  if (line.trim().length === 0)
    return { ok: false, codePoints, lines, reason: "blank" };
  if (lines !== 1)
    return { ok: false, codePoints, lines, reason: "not one line" };
  if (codePoints < 1 || codePoints > 280)
    return { ok: false, codePoints, lines, reason: "outside 1-280 chars" };
  return { ok: true, codePoints, lines };
}

function verifyWritten(path: string): string {
  const text = readFileSync(path, "utf8");
  return createHash("sha256").update(text).digest("hex");
}

function main(): void {
  const line = buildLine();
  const gate = validateEntry(line);
  if (!gate.ok) {
    throw new Error(`gate failed: ${gate.reason} (${gate.codePoints} cp)`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const text = line + "\n";
  const outPath = `${outDir}/entry.txt`;
  writeFileSync(outPath, text);
  const sha = verifyWritten(outPath);
  console.log(
    `gate passes: ${gate.codePoints} code points, not only whitespace`,
  );
  console.log(`wrote ${outPath} (${gate.codePoints} code points, sha256 ${sha})`);
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();
