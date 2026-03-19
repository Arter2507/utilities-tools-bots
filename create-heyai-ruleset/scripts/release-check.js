#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

function printOutput(result) {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

function runStep(label, cmd, args) {
  process.stdout.write(`\n[STEP] ${label}\n`);
  const result = spawnSync(cmd, args, { encoding: "utf8" });
  if (result.error) {
    throw new Error(`${label} failed: ${result.error.message}`);
  }
  printOutput(result);
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function runStepCommandLine(label, commandLine) {
  process.stdout.write(`\n[STEP] ${label}\n`);
  const isWindows = process.platform === "win32";
  const runner = isWindows ? process.env.ComSpec || "cmd.exe" : "/bin/sh";
  const runnerArgs = isWindows
    ? ["/d", "/s", "/c", commandLine]
    : ["-lc", commandLine];
  const result = spawnSync(runner, runnerArgs, { encoding: "utf8" });
  if (result.error) {
    throw new Error(`${label} failed: ${result.error.message}`);
  }
  printOutput(result);
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function main() {
  runStep("Syntax check", "node", ["--check", "index.js"]);
  runStepCommandLine("Dry pack", "npm pack --dry-run");
  runStepCommandLine("Auth check (npm whoami)", "npm whoami");
  process.stdout.write("\n[OK] Release checks passed. Ready to publish.\n");
}

try {
  main();
} catch (error) {
  process.stderr.write(`\n[FAIL] ${error.message}\n`);
  process.exitCode = 1;
}
