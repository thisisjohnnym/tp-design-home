#!/usr/bin/env node
/**
 * Memory soak test in real WebKit at iPhone size (390×844 @3×).
 *
 * Opens the page with ?autoscroll, lets it scroll down and back up for a few
 * passes, samples the WebKit GPU + WebContent processes with macOS `footprint`,
 * and fails if the peak GPU footprint goes over budget or the page crashes.
 *
 *   pnpm audit:mem                      # production site
 *   pnpm audit:mem http://localhost:3002
 *   MEM_BUDGET_MB=500 MEM_PASSES=3 pnpm audit:mem
 *
 * macOS only (footprint). The GPU process carries ~250MB of fixed overhead
 * before the page draws anything; the budget includes it.
 */
import { execSync } from "node:child_process";
import { webkit } from "playwright-core";

const url = process.argv[2] ?? "https://tp-design-home.vercel.app";
const budget = Number(process.env.MEM_BUDGET_MB ?? 520);
const passes = Number(process.env.MEM_PASSES ?? 2);
const legSeconds = Number(process.env.MEM_LEG_SECONDS ?? 12);

function footprintMb(pid) {
  try {
    const out = execSync(`footprint -p ${pid} 2>/dev/null`).toString();
    const match = out.match(/Footprint:\s+([\d.]+)\s+(KB|MB|GB)/);
    if (!match) return 0;
    const scale = { KB: 1 / 1024, MB: 1, GB: 1024 }[match[2]];
    return Math.round(Number(match[1]) * scale);
  } catch {
    return 0;
  }
}

function sample() {
  const lines = execSync(
    "pgrep -fl 'ms-playwright/webkit-.*com.apple.WebKit.(GPU|WebContent)' || true",
  )
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);
  const result = { gpu: 0, web: 0 };
  for (const line of lines) {
    const [pid] = line.split(" ");
    const key = line.includes("WebKit.GPU") ? "gpu" : "web";
    result[key] = Math.max(result[key], footprintMb(pid));
  }
  return result;
}

const browser = await webkit.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

let crashed = false;
const errors = [];
page.on("crash", () => {
  crashed = true;
});
page.on("pageerror", (error) => errors.push(error.message));

const separator = url.includes("?") ? "&" : "?";
await page.goto(`${url}${separator}autoscroll=${legSeconds}`, {
  waitUntil: "networkidle",
});

const peak = { gpu: 0, web: 0, at: "" };

/** Which section sits at the middle of the viewport right now. */
const whereAmI = () =>
  page
    .evaluate(() => {
      const probe = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
      );
      const section = probe?.closest("section, [class^='hs-layer']");
      const name = section?.className.toString().split(" ")[0] || "?";
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return `${name} @${Math.round((window.scrollY / Math.max(1, max)) * 100)}%`;
    })
    .catch(() => "?");
const deadline = Date.now() + (passes * 2 * legSeconds + 15) * 1000;
let lastPass = -1;
while (Date.now() < deadline && !crashed) {
  await page.waitForTimeout(1000);
  const now = sample();
  if (now.gpu > peak.gpu) {
    peak.gpu = now.gpu;
    peak.at = await whereAmI();
  }
  peak.web = Math.max(peak.web, now.web);
  const title = await page.title().catch(() => "");
  const pass = Number(title.match(/pass (\d+)/)?.[1] ?? 0);
  if (pass !== lastPass) {
    lastPass = pass;
    console.log(`pass ${pass}: gpu ${now.gpu}MB, web ${now.web}MB`);
  }
  if (pass >= passes) break;
}

await browser.close();

console.log(
  `\npeak gpu ${peak.gpu}MB at ${peak.at} (budget ${budget}MB), peak web ${peak.web}MB`,
);
if (errors.length) console.log(`page errors:\n  ${errors.join("\n  ")}`);

if (crashed) {
  console.error("FAIL: page crashed");
  process.exit(1);
}
if (peak.gpu > budget) {
  console.error("FAIL: GPU memory over budget");
  process.exit(1);
}
if (errors.length) {
  console.error("FAIL: page errors");
  process.exit(1);
}
console.log("PASS");
