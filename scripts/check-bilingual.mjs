import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const FORK = "evan188199-tech/skills";
const LICENSE_SHA256 =
  "0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5";
const BUCKETS = ["engineering", "productivity", "misc", "in-progress", "deprecated"];

let failed = false;
function fail(file, msg) {
  failed = true;
  console.error(`✗ ${file}: ${msg}`);
}
function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walkMarkdown(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.name.endsWith(".md")) out.push(path.relative(process.cwd(), full));
  }
  return out;
}

function inScopeFiles() {
  const files = new Set(["README.md", ...BUCKETS.map((b) => `skills/${b}/README.md`)]);
  for (const f of walkMarkdown("docs")) files.add(f);
  for (const f of walkMarkdown("skills")) {
    if (f.includes("/agents/")) continue;
    files.add(f);
  }
  return [...files].filter((f) => !f.endsWith(".zh-CN.md")).sort();
}

const zhPathOf = (file) => file.replace(/\.md$/, ".zh-CN.md");
const enBase = (file) => path.basename(file);
const zhBase = (file) => path.basename(zhPathOf(file));
const switcher = (file) => `[English](${enBase(file)}) · [简体中文](${zhBase(file)})`;

function hasSwitcher(text, file) {
  return text.includes(switcher(file));
}

function checkFences(file, text) {
  const fences = text.match(/```/g) || [];
  if (fences.length % 2 !== 0) fail(file, "unbalanced fenced code blocks");
}

function checkFrontmatter(file, text) {
  const fm = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fm) {
    fail(file, "missing or malformed YAML frontmatter");
    return;
  }
  const name = fm[1].match(/^name:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
  const description = fm[1].match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
  if (!name) fail(file, "missing frontmatter name");
  if (!description) fail(file, "missing frontmatter description");
  if (name && /[^\x00-\x7F]/.test(name)) {
    fail(file, "frontmatter name should remain an ASCII slug");
  }
}

const zhSiblings = [];

for (const file of inScopeFiles()) {
  const zhPath = zhPathOf(file);
  if (!fs.existsSync(file)) {
    fail(file, "in-scope English file missing");
    continue;
  }
  if (!fs.existsSync(zhPath)) {
    fail(zhPath, "missing Chinese sibling for in-scope file");
    continue;
  }
  zhSiblings.push(zhPath);

  const en = read(file);
  const zh = read(zhPath);
  if (!hasSwitcher(en, file)) fail(file, "missing language switcher link");
  if (!hasSwitcher(zh, file)) fail(zhPath, "missing language switcher link");
  checkFences(file, en);
  checkFences(zhPath, zh);
  if (path.basename(file) === "SKILL.md") {
    checkFrontmatter(file, en);
    checkFrontmatter(zhPath, zh);
    const enName = en.match(/^---\s*\n([\s\S]*?)\n---/)?.[1]
      ?.match(/^name:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
    const zhName = zh.match(/^---\s*\n([\s\S]*?)\n---/)?.[1]
      ?.match(/^name:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
    if (enName && zhName && enName !== zhName) {
      fail(zhPath, `frontmatter name ${zhName} does not match English ${enName}`);
    }
  }
}

for (const file of [...walkMarkdown("docs"), ...walkMarkdown("skills")]) {
  if (!file.endsWith(".zh-CN.md")) continue;
  const enCounterpart = file.replace(/\.zh-CN\.md$/, ".md");
  if (!fs.existsSync(enCounterpart) && file !== "LICENSE.zh-CN.md") {
    fail(file, `Chinese file without English counterpart ${enCounterpart}`);
  }
}

const rootReadme = fs.existsSync("README.md") ? read("README.md") : "";
const rootReadmeZh = fs.existsSync("README.zh-CN.md") ? read("README.zh-CN.md") : "";
for (const [name, text] of [["README.md", rootReadme], ["README.zh-CN.md", rootReadmeZh]]) {
  if (text && !text.includes(`npx skills@latest add ${FORK}`)) {
    fail(name, `install command does not point at ${FORK}`);
  }
}

if (fs.existsSync("LICENSE")) {
  const sha = crypto.createHash("sha256").update(read("LICENSE")).digest("hex");
  if (sha !== LICENSE_SHA256) fail("LICENSE", "LICENSE was modified");
} else {
  fail("LICENSE", "LICENSE missing");
}
if (!fs.existsSync("LICENSE.zh-CN.md")) {
  fail("LICENSE.zh-CN.md", "missing unofficial Chinese license translation");
}

console.log(
  failed
    ? "\nbilingual check failed"
    : `\nOK: ${zhSiblings.length} zh-CN siblings verified`,
);
process.exit(failed ? 1 : 0);
