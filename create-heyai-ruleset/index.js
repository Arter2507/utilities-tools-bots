#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const { spawnSync } = require("node:child_process");

const HIDDEN_RULES_DIR = ".heyai-ruleset";
const AGENT_CONFIG_FILENAME = "HEYAI.agent.md";
const ROOT_INSTALL_REPORT_FILENAME = "install-report.md";
const EXCLUDED_DIRS = new Set(["session_checkpoint", "walkthrough"]);
const RULE_FILES = [
  "CODE_STANDARDS.md",
  "GIT_WORKFLOW.md",
  "IDENTITY_SOUL.md",
  "MAP.md",
  "MEMORIES.md",
  "PROTOCOLS.md",
  "RULES.md",
  "SECURITY.md",
  "SYSTEM_DESIGN.md",
  "TESTING_POLICY.md",
  "WORKFLOWS.md",
];

function logInfo(message) {
  stdout.write(`[INFO] ${message}\n`);
}

function logWarn(message) {
  stdout.write(`[WARN] ${message}\n`);
}

function logError(message) {
  stdout.write(`[ERROR] ${message}\n`);
}

function parseArgs(argv) {
  const args = {
    targetDir: process.cwd(),
    yes: false,
    nonInteractive: false,
    kits: "",
    noKits: false,
    customLinks: "",
    configureDesign: false,
    skipDesign: false,
    lightColor: "",
    lightTheme: "",
    darkColor: "",
    darkTheme: "",
    agentName: "",
    agentConfigPath: "",
    overwriteAgentConfig: false,
    help: false,
  };

  const positional = [];
  const rest = argv.slice(2);

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    const next = rest[i + 1];
    const valueRequired = () => {
      if (!next || next.startsWith("-")) {
        throw new Error(`Missing value for option: ${token}`);
      }
      i += 1;
      return next;
    };

    if (!token.startsWith("-")) {
      positional.push(token);
      continue;
    }

    switch (token) {
      case "--yes":
      case "-y":
        args.yes = true;
        break;
      case "--non-interactive":
        args.nonInteractive = true;
        break;
      case "--target":
      case "-t":
        args.targetDir = path.resolve(process.cwd(), valueRequired());
        break;
      case "--kits":
        args.kits = valueRequired();
        break;
      case "--no-kits":
        args.noKits = true;
        break;
      case "--custom-links":
        args.customLinks = valueRequired();
        break;
      case "--configure-design":
        args.configureDesign = true;
        break;
      case "--skip-design":
        args.skipDesign = true;
        break;
      case "--light-color":
        args.lightColor = valueRequired();
        break;
      case "--light-theme":
        args.lightTheme = valueRequired();
        break;
      case "--dark-color":
        args.darkColor = valueRequired();
        break;
      case "--dark-theme":
        args.darkTheme = valueRequired();
        break;
      case "--agent-name":
        args.agentName = valueRequired();
        break;
      case "--agent-config-path":
        args.agentConfigPath = valueRequired();
        break;
      case "--overwrite-agent-config":
        args.overwriteAgentConfig = true;
        break;
      case "--help":
      case "-h":
        args.help = true;
        break;
      default:
        throw new Error(`Unknown option: ${token}`);
    }
  }

  if (positional[0]) {
    args.targetDir = path.resolve(process.cwd(), positional[0]);
  }

  return args;
}

function printUsage() {
  const message = [
    "Usage:",
    "  create-heyai-ruleset [targetDir] [options]",
    "",
    "Options:",
    "  -y, --yes                     Use defaults and skip prompts",
    "  --non-interactive             Disable prompts (for CI)",
    "  -t, --target <path>           Target project root",
    "  --kits <indexes>              Default kit indexes, e.g. 1,3",
    "  --no-kits                     Skip all default kit installs",
    "  --custom-links <links>        Comma-separated GitHub links",
    "  --configure-design            Enable design overrides",
    "  --skip-design                 Keep existing design defaults",
    "  --light-color <text>          Lightmode color text",
    "  --light-theme <text>          Lightmode theme text",
    "  --dark-color <text>           Darkmode color text",
    "  --dark-theme <text>           Darkmode theme text",
    "  --agent-name <name>           Agent name (default: AI)",
    "  --agent-config-path <path>    Optional explicit path (must be project-root/HEYAI.agent.md)",
    "  --overwrite-agent-config      Overwrite agent config file if exists",
    "  -h, --help                    Show help",
  ];
  stdout.write(`${message.join("\n")}\n`);
}

function readTextIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function extractDefaultKits(systemDesignText) {
  const sectionMatch = systemDesignText.match(
    /##\s+🛠️\s+3\.\s+DEFAULT KITS & SKILLS([\s\S]*?)(?:\n##\s|\n---|$)/i,
  );
  if (!sectionMatch) {
    return [];
  }
  const sectionBody = sectionMatch[1];
  const lines = sectionBody
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\./.test(line));

  const kits = [];
  for (const line of lines) {
    const titleMatch = line.match(/^\d+\.\s+\*\*(.+?)\*\*:/);
    const title = titleMatch ? titleMatch[1].trim() : line;
    const links = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let m;
    while ((m = linkRegex.exec(line)) !== null) {
      links.push({ label: m[1], url: m[2] });
    }
    if (links.length <= 1) {
      kits.push({ title, links, raw: line });
      continue;
    }

    for (const link of links) {
      kits.push({
        title: `${title} - ${link.label}`,
        links: [link],
        raw: line,
      });
    }
  }
  return kits;
}

function extractModeDefaults(systemDesignText) {
  const lightRegex =
    /^\|\s*\*\*Lightmode\*\*\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/im;
  const darkRegex =
    /^\|\s*\*\*Darkmode\*\*\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/im;
  const lightMatch = systemDesignText.match(lightRegex);
  const darkMatch = systemDesignText.match(darkRegex);
  return {
    light: {
      color: lightMatch ? lightMatch[1].trim() : "",
      theme: lightMatch ? lightMatch[2].trim() : "",
    },
    dark: {
      color: darkMatch ? darkMatch[1].trim() : "",
      theme: darkMatch ? darkMatch[2].trim() : "",
    },
  };
}

const KIT_INSTALL_COMMANDS = {
  "Dokhacgiakhoa/antigravity-ide": "npx antigravity-ide@latest",
};
const KIT_INSTALL_MARKERS = {
  "Dokhacgiakhoa/antigravity-ide": [".agent", "GEMINI.md", "docs"],
  "vudovn/antigravity-kit": [".agent"],
};

function extractRepoSlug(url) {
  const match = url.match(/^https?:\/\/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
  if (!match) {
    return "";
  }
  return `${match[1]}/${match[2].replace(/\.git$/i, "")}`;
}

async function inferInstallCommandFromReadme(url) {
  const slug = extractRepoSlug(url);
  if (!slug) {
    return "";
  }

  if (KIT_INSTALL_COMMANDS[slug]) {
    return KIT_INSTALL_COMMANDS[slug];
  }

  const candidates = [
    `https://raw.githubusercontent.com/${slug}/HEAD/README.md`,
    `https://raw.githubusercontent.com/${slug}/main/README.md`,
    `https://raw.githubusercontent.com/${slug}/master/README.md`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate);
      if (!response.ok) {
        continue;
      }
      const text = await response.text();
      const lines = text.split(/\r?\n/).map((line) => line.trim());
      const command = lines.find(
        (line) =>
          /^npx\s+/i.test(line) ||
          /^pnpm\s+dlx\s+/i.test(line) ||
          /^pnpm\s+create\s+/i.test(line) ||
          /^npm\s+create\s+/i.test(line),
      );
      if (command) {
        return command;
      }
    } catch {
      continue;
    }
  }

  return "";
}

function runCommand(command, cwd, interactiveMode) {
  return spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8",
    stdio: interactiveMode ? "inherit" : "pipe",
  });
}

function getProjectSnapshot(rootDir) {
  const snapshot = new Set();
  function walk(currentPath, relativeBase = "") {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const rel = relativeBase
        ? `${relativeBase}/${entry.name}`
        : entry.name;
      snapshot.add(rel);
      if (entry.isDirectory()) {
        walk(path.join(currentPath, entry.name), rel);
      }
    }
  }
  try {
    walk(rootDir, "");
  } catch {
    return snapshot;
  }
  return snapshot;
}

function hasSnapshotChanged(before, after) {
  if (before.size !== after.size) {
    return true;
  }
  for (const item of before) {
    if (!after.has(item)) {
      return true;
    }
  }
  return false;
}

function hasExpectedMarker(rootDir, repoSlug) {
  const markers = KIT_INSTALL_MARKERS[repoSlug];
  if (!markers || markers.length === 0) {
    return false;
  }
  return markers.some((marker) => fs.existsSync(path.join(rootDir, marker)));
}

function parseGithubLinksCommaSeparated(input) {
  if (!input || !input.trim()) {
    return [];
  }
  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((item) => /^https?:\/\/github\.com\/[^/\s]+\/[^/\s]+/i.test(item));
}

function parseCommaNumbers(input) {
  if (!input || !input.trim()) {
    return [];
  }
  return input
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((n) => Number.isInteger(n));
}

function replaceModeRow(systemDesignText, mode, color, theme) {
  const rowRegex = new RegExp(
    `^\\|\\s*\\*\\*${mode}\\*\\*\\s*\\|\\s*([^|]+?)\\s*\\|\\s*([^|]+?)\\s*\\|`,
    "im",
  );
  return systemDesignText.replace(
    rowRegex,
    `| **${mode}** | ${color} | ${theme} |`,
  );
}

function updateManagedBlock(systemDesignText, content) {
  const start = "<!-- HEYAI-INSTALLER:START -->";
  const end = "<!-- HEYAI-INSTALLER:END -->";
  const block = `${start}\n${content}\n${end}`;
  const existingRegex =
    /<!-- HEYAI-INSTALLER:START -->[\s\S]*?<!-- HEYAI-INSTALLER:END -->/m;
  if (existingRegex.test(systemDesignText)) {
    return systemDesignText.replace(existingRegex, block);
  }
  return `${systemDesignText.trimEnd()}\n\n---\n\n${block}\n`;
}

function pathEqualsNormalized(a, b) {
  return path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
}

async function ensureDirectory(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function copyRuleFiles(packageDir, destRulesDir) {
  await ensureDirectory(destRulesDir);
  for (const file of RULE_FILES) {
    const source = path.join(packageDir, file);
    const dest = path.join(destRulesDir, file);
    if (!fs.existsSync(source)) {
      logWarn(`Bỏ qua file không tồn tại trong package: ${file}`);
      continue;
    }
    await fsp.copyFile(source, dest);
  }
}

function getKitInstallTargets(selectedKitIndexes, kits) {
  const urls = [];
  for (const index of selectedKitIndexes) {
    const kit = kits[index];
    if (!kit) {
      continue;
    }
    for (const link of kit.links) {
      urls.push({
        source: kit.title,
        url: link.url,
      });
    }
  }
  return urls;
}

function buildAgentConfigContent({
  agentName,
  projectRoot,
  rulesDirName = HIDDEN_RULES_DIR,
}) {
  const resolvedName = agentName && agentName.trim() ? agentName.trim() : "AI";
  return `---
agent_name: "${resolvedName}"
activation_greetings:
  - "Hey, AI"
  - "Hey, ${resolvedName}"
language_policy:
  mode: "user_primary_language"
  fallback: "ask_user_to_choose_language"
project_root: "${projectRoot.replace(/\\/g, "/")}"
rules_root: "${rulesDirName}"
rule_priority:
  - "MAP.md"
  - "IDENTITY_SOUL.md"
  - "PROTOCOLS.md"
  - "RULES.md"
  - "WORKFLOWS.md"
  - "CODE_STANDARDS.md"
  - "SYSTEM_DESIGN.md"
---

# HEYAI Agent Configuration

Use this file as the single source of truth for agent identity and rule-loading order.

Language behavior:
- Detect and use the user's primary language for all responses after trigger ("choose language" if unclear).
- Tự động nhận diện và sử dụng ngôn ngữ chính của người dùng (yêu cầu chọn nếu không rõ).

When a conversation starts with "Hey, AI" or "Hey, ${resolvedName}", load rules from \`${rulesDirName}\` in this priority:
1. \`${rulesDirName}/MAP.md\`
2. \`${rulesDirName}/IDENTITY_SOUL.md\`
3. \`${rulesDirName}/PROTOCOLS.md\`
4. \`${rulesDirName}/RULES.md\`
5. \`${rulesDirName}/WORKFLOWS.md\`
6. \`${rulesDirName}/CODE_STANDARDS.md\`
7. \`${rulesDirName}/SYSTEM_DESIGN.md\`
`;
}

function buildRootAgentsBridgeContent(
  agentName,
  rulesDirName = HIDDEN_RULES_DIR,
) {
  const resolvedName = agentName && agentName.trim() ? agentName.trim() : "AI";
  return [
    "<!-- HEYAI-RULE-BRIDGE:START -->",
    "# HEYAI Rule Bridge",
    "",
    'When user message starts with "Hey, AI" or "Hey, ' + resolvedName + '":',
    "0. Detect user's primary language and respond in that language (nhận diện và phản hồi bằng ngôn ngữ chính của người dùng).",
    `1. Load \`${rulesDirName}/MAP.md\`.`,
    `2. Load \`${rulesDirName}/IDENTITY_SOUL.md\`.`,
    `3. Load \`${rulesDirName}/PROTOCOLS.md\`.`,
    `4. Load \`${rulesDirName}/RULES.md\`.`,
    `5. Load \`${rulesDirName}/WORKFLOWS.md\`.`,
    `6. Load \`${rulesDirName}/CODE_STANDARDS.md\`.`,
    `7. Load \`${rulesDirName}/SYSTEM_DESIGN.md\`.`,
    "8. Reply by strictly following those rules and workflows.",
    "",
    "<!-- HEYAI-RULE-BRIDGE:END -->",
  ].join("\n");
}

function upsertManagedBlock(originalText, startMarker, endMarker, block) {
  const escapedStart = startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = endMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escapedStart}[\\s\\S]*?${escapedEnd}`, "m");
  if (regex.test(originalText)) {
    return originalText.replace(regex, block);
  }
  return `${originalText.trimEnd()}\n\n${block}\n`;
}

async function promptInput(rl, label, defaultValue = "") {
  if (!rl) {
    return defaultValue;
  }
  const prompt = defaultValue
    ? `${label} (mặc định: ${defaultValue}): `
    : `${label}: `;
  const answer = (await rl.question(prompt)).trim();
  return answer || defaultValue;
}

async function promptYesNo(rl, label, defaultYes = true) {
  if (!rl) {
    return defaultYes;
  }
  const hint = defaultYes ? "Y/n" : "y/N";
  const answer = (await rl.question(`${label} (${hint}): `))
    .trim()
    .toLowerCase();
  if (!answer) {
    return defaultYes;
  }
  return answer === "y" || answer === "yes";
}

function parseKitIndexes(kits, input) {
  const chosen = parseCommaNumbers(input);
  if (chosen.includes(0)) {
    return {
      selectedKitIndexes: [],
      includeCustom: false,
    };
  }

  const selectedKitIndexes = [];
  for (const n of chosen) {
    if (n >= 1 && n <= kits.length) {
      selectedKitIndexes.push(n - 1);
    }
  }

  return {
    selectedKitIndexes: [...new Set(selectedKitIndexes)],
    includeCustom: chosen.includes(kits.length + 1),
  };
}

async function promptKitSelection(rl, kits, args, interactiveMode) {
  if (args.noKits) {
    return {
      selectedKitIndexes: [],
      includeCustom: false,
    };
  }

  if (!interactiveMode) {
    return parseKitIndexes(kits, args.kits || "");
  }

  stdout.write("\n[B2] Chọn kit/skills muốn cài:\n");
  stdout.write("0. Khong cai them\n");
  kits.forEach((kit, idx) => {
    const urlPreview =
      kit.links.length > 0
        ? kit.links.map((x) => x.url).join(", ")
        : "Khong co link";
    stdout.write(`${idx + 1}. ${kit.title} -> ${urlPreview}\n`);
  });
  const customIndex = kits.length + 1;
  stdout.write(
    `${customIndex}. Tu cai (nhap link GitHub, cach nhau boi dau phay)\n`,
  );
  const raw = await promptInput(
    rl,
    "Nhap danh sach so (co the nhieu so, vd: 1,3 hoac 0)",
  );
  return parseKitIndexes(kits, raw);
}

async function resolveAgentConfigPath(rl, targetRoot, args, interactiveMode) {
  const rootPath = path.join(targetRoot, AGENT_CONFIG_FILENAME);
  if (!args.agentConfigPath) {
    return rootPath;
  }
  const requested = path.resolve(args.agentConfigPath);
  if (!pathEqualsNormalized(requested, rootPath)) {
    throw new Error(
      `${AGENT_CONFIG_FILENAME} must be created at project root: ${rootPath}`,
    );
  }
  return rootPath;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printUsage();
    return;
  }

  const packageDir = __dirname;
  const targetRoot = args.targetDir;
  const interactiveMode = !(args.yes || args.nonInteractive);

  const rl = interactiveMode
    ? readline.createInterface({ input: stdin, output: stdout })
    : null;
  try {
    await ensureDirectory(targetRoot);
    const sourceSystemDesignPath = path.join(packageDir, "SYSTEM_DESIGN.md");
    const sourceSystemDesignText = readTextIfExists(sourceSystemDesignPath);
    if (!sourceSystemDesignText) {
      throw new Error("Khong tim thay SYSTEM_DESIGN.md trong package.");
    }

    const kits = extractDefaultKits(sourceSystemDesignText);
    const defaults = extractModeDefaults(sourceSystemDesignText);

    logInfo(`Project root: ${targetRoot}`);
    logInfo(`Rules folder: ${path.join(targetRoot, HIDDEN_RULES_DIR)}`);
    logInfo(
      `Nguon rule se bo qua thu muc: ${Array.from(EXCLUDED_DIRS).join(", ")} (neu co)`,
    );

    const { selectedKitIndexes, includeCustom } = await promptKitSelection(
      rl,
      kits,
      args,
      interactiveMode,
    );
    let customLinks = [];
    if (!interactiveMode && args.customLinks) {
      customLinks = parseGithubLinksCommaSeparated(args.customLinks);
    } else if (includeCustom) {
      const customRaw = await promptInput(
        rl,
        "Nhap link GitHub tuy chinh (cach nhau boi dau phay)",
      );
      customLinks = parseGithubLinksCommaSeparated(customRaw);
      if (customLinks.length === 0) {
        logWarn("Khong co link GitHub hop le trong danh sach custom.");
      }
    }

    let lightColor = defaults.light.color;
    let lightTheme = defaults.light.theme;
    let darkColor = defaults.dark.color;
    let darkTheme = defaults.dark.theme;

    const hasDesignOverrideArgs = Boolean(
      args.lightColor || args.lightTheme || args.darkColor || args.darkTheme,
    );
    let configureDesign = false;
    if (args.skipDesign) {
      configureDesign = false;
    } else if (args.configureDesign || hasDesignOverrideArgs) {
      configureDesign = true;
    } else if (interactiveMode) {
      configureDesign = await promptYesNo(
        rl,
        "\n[B3] Ban co muon tu cau hinh mau sac/theme cho Lightmode va Darkmode khong?",
        true,
      );
    }

    if (configureDesign) {
      lightColor =
        args.lightColor ||
        (await promptInput(
          rl,
          "Lightmode - mau sac",
          defaults.light.color || "Mac dinh hien tai",
        ));
      lightTheme =
        args.lightTheme ||
        (await promptInput(
          rl,
          "Lightmode - theme",
          defaults.light.theme || "Mac dinh hien tai",
        ));
      darkColor =
        args.darkColor ||
        (await promptInput(
          rl,
          "Darkmode - mau sac",
          defaults.dark.color || "Mac dinh hien tai",
        ));
      darkTheme =
        args.darkTheme ||
        (await promptInput(
          rl,
          "Darkmode - theme",
          defaults.dark.theme || "Mac dinh hien tai",
        ));
    }

    const agentName =
      args.agentName ||
      (await promptInput(
        rl,
        "Nhap ten Agent (de trong de dung mac dinh AI)",
        "AI",
      ));
    const agentConfigPath = await resolveAgentConfigPath(
      rl,
      targetRoot,
      args,
      interactiveMode,
    );

    const rulesDir = path.join(targetRoot, HIDDEN_RULES_DIR);
    await copyRuleFiles(packageDir, rulesDir);

    const destSystemDesignPath = path.join(rulesDir, "SYSTEM_DESIGN.md");
    let destSystemDesignText = readTextIfExists(destSystemDesignPath);
    if (!destSystemDesignText) {
      throw new Error(`Khong tim thay file: ${destSystemDesignPath}`);
    }

    destSystemDesignText = replaceModeRow(
      destSystemDesignText,
      "Lightmode",
      lightColor,
      lightTheme,
    );
    destSystemDesignText = replaceModeRow(
      destSystemDesignText,
      "Darkmode",
      darkColor,
      darkTheme,
    );

    const chosenKits = selectedKitIndexes
      .map((idx) => kits[idx])
      .filter(Boolean);
    const installedKitSummaryLines = [];
    if (chosenKits.length === 0 && customLinks.length === 0) {
      installedKitSummaryLines.push("- Khong cai them kit nao.");
    } else {
      for (const kit of chosenKits) {
        const urls = kit.links.map((x) => x.url).join(", ");
        installedKitSummaryLines.push(`- ${kit.title}: ${urls}`);
      }
      for (const link of customLinks) {
        installedKitSummaryLines.push(`- Custom: ${link}`);
      }
    }

    const overrideBlock = [
      "### HEYAI Installer Overrides",
      "",
      `- Installed at: ${new Date().toISOString()}`,
      `- Rules folder: ${HIDDEN_RULES_DIR}`,
      "",
      "#### Kit Selection",
      ...installedKitSummaryLines,
      "",
      "#### Design Overrides",
      `- Lightmode: ${lightColor} | ${lightTheme}`,
      `- Darkmode: ${darkColor} | ${darkTheme}`,
    ].join("\n");

    destSystemDesignText = updateManagedBlock(
      destSystemDesignText,
      overrideBlock,
    );
    await fsp.writeFile(destSystemDesignPath, destSystemDesignText, "utf8");

    const kitTargets = getKitInstallTargets(selectedKitIndexes, kits).concat(
      customLinks.map((url) => ({ source: "Custom", url })),
    );
    const installReport = [];

    if (kitTargets.length > 0) {
      for (const target of kitTargets) {
        logInfo(`Dang xu ly kit: ${target.url}`);
        const installCommand = await inferInstallCommandFromReadme(target.url);
        if (!installCommand) {
          installReport.push(
            `[SKIP] ${target.url}\nNo install command detected from README. Please follow project instructions manually.`,
          );
          continue;
        }

        const repoSlug = extractRepoSlug(target.url);
        const beforeSnapshot = getProjectSnapshot(targetRoot);
        const run = runCommand(installCommand, targetRoot, interactiveMode);
        const afterSnapshot = getProjectSnapshot(targetRoot);
        const changed = hasSnapshotChanged(beforeSnapshot, afterSnapshot);
        const markerFound = hasExpectedMarker(targetRoot, repoSlug);

        if (run.status === 0 && (changed || markerFound)) {
          installReport.push(
            `[OK] ${target.url}\nCommand: ${installCommand}\nDetected project changes: ${changed}\nDetected marker: ${markerFound}`,
          );
          continue;
        }

        if (run.status === 0 && !changed && !markerFound) {
          installReport.push(
            `[WARN] ${target.url}\nCommand: ${installCommand}\nCommand finished but no project changes were detected. Installation likely not completed (interactive wizard may have been cancelled).`,
          );
          logWarn(`Khong thay doi du an sau khi chay kit: ${target.url}`);
          continue;
        }

        const err = run.stderr || run.stdout || "Unknown install error.";
        installReport.push(
          `[FAIL] ${target.url}\nCommand: ${installCommand}\n${err}`,
        );
        logWarn(`Cai dat that bai cho kit: ${target.url}`);
      }
    } else {
      installReport.push("No kits selected for installation.");
    }

    const rulesFilesInstalled = RULE_FILES.map((file) => `- ${HIDDEN_RULES_DIR}/${file}`);
    const reportBody = [
      "# HEYAI Install Report",
      "",
      "## Core HEYAI Ruleset",
      `- Installed directory: ${HIDDEN_RULES_DIR}`,
      ...rulesFilesInstalled,
      "",
      "## Kit Installation Results",
      ...installReport,
      "",
    ].join("\n");

    const rootInstallReportPath = path.join(
      targetRoot,
      ROOT_INSTALL_REPORT_FILENAME,
    );
    await fsp.writeFile(rootInstallReportPath, reportBody, "utf8");

    const legacyInstallReportPath = path.join(rulesDir, "install-report.md");
    await fsp.writeFile(legacyInstallReportPath, reportBody, "utf8");

    await ensureDirectory(path.dirname(agentConfigPath));
    const agentExists = fs.existsSync(agentConfigPath);
    let shouldWriteAgentFile = true;
    if (agentExists) {
      if (args.overwriteAgentConfig) {
        shouldWriteAgentFile = true;
      } else if (interactiveMode) {
        shouldWriteAgentFile = await promptYesNo(
          rl,
          `${AGENT_CONFIG_FILENAME} da ton tai. Ban co muon ghi de khong?`,
          false,
        );
      } else {
        shouldWriteAgentFile = false;
        logWarn(
          `${AGENT_CONFIG_FILENAME} already exists and overwrite is disabled; skip writing.`,
        );
      }
    }
    if (shouldWriteAgentFile) {
      const content = buildAgentConfigContent({
        agentName,
        projectRoot: targetRoot,
      });
      await fsp.writeFile(agentConfigPath, content, "utf8");
    }

    const rootAgentsPath = path.join(targetRoot, "AGENTS.md");
    const existingRootAgents = readTextIfExists(rootAgentsPath) || "";
    const bridgeBlock = buildRootAgentsBridgeContent(agentName);
    const nextRootAgents = upsertManagedBlock(
      existingRootAgents || "# AGENTS\n",
      "<!-- HEYAI-RULE-BRIDGE:START -->",
      "<!-- HEYAI-RULE-BRIDGE:END -->",
      bridgeBlock,
    );
    await fsp.writeFile(rootAgentsPath, nextRootAgents, "utf8");

    logInfo("Hoan tat cai dat.");
    logInfo(`Rules: ${rulesDir}`);
    logInfo(`SYSTEM_DESIGN da cap nhat: ${destSystemDesignPath}`);
    logInfo(`Bao cao cai dat (root): ${rootInstallReportPath}`);
    logInfo(`Bao cao cai dat (legacy): ${legacyInstallReportPath}`);
    logInfo(`Agent config: ${agentConfigPath}`);
    logInfo(`Root AGENTS bridge: ${rootAgentsPath}`);
    logInfo(`Trigger greetings: "Hey, AI", "Hey, ${agentName}"`);
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

main().catch((error) => {
  logError(error && error.message ? error.message : String(error));
  process.exitCode = 1;
});
// trigger fix
