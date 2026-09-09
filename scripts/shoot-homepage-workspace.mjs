// playwright is deliberately NOT a dependency of this project: it is needed
// only by this script, and declaring it would pull a browser download into
// every install. Import it dynamically so a missing install produces an
// actionable message instead of an opaque module-not-found.
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "playwright is not installed, and this script is the only thing that needs it.\n" +
      "Install it on demand:\n" +
      "  npm i -D playwright && npx playwright install chromium",
  );
  process.exit(1);
}

const outDir = process.argv[2] ?? ".superdesign/tmp";
const baseUrl = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const session = process.env.ITFY_ADMIN_SESSION;

if (!session) {
  console.error(
    "Set ITFY_ADMIN_SESSION to the value of your itfy-admin-session cookie.\n" +
      "Copy it from your browser's devtools while signed in to /admin.",
  );
  process.exit(1);
}

// Each entry pairs a viewport button with the widest Tailwind breakpoint that
// must match inside the iframe at that width. This is the actual claim under
// test: the iframe drives the breakpoints, not the admin window.
const VIEWPORTS = [
  { label: "Desktop preview", name: "desktop", lgMustMatch: true },
  { label: "Tablet preview", name: "tablet", lgMustMatch: false },
  { label: "Mobile preview", name: "mobile", lgMustMatch: false },
];

const browser = await chromium.launch();
let failures = 0;

// Everything below runs inside try/finally so a timeout on goto or on the
// iframe wait cannot leave a Chromium process behind.
try {
const context = await browser.newContext({
  viewport: { width: 1800, height: 1100 },
});
await context.addCookies([
  {
    name: "itfy-admin-session",
    value: session,
    url: baseUrl,
  },
]);

const page = await context.newPage();
page.on("console", (message) => {
  if (message.type() === "error") {
    console.log("PAGE ERROR", message.text());
  }
});

await page.goto(`${baseUrl}/admin/content/homepage`, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

await page.locator('iframe[title="Homepage preview"]').waitFor({
  state: "visible",
  timeout: 30000,
});

for (const viewport of VIEWPORTS) {
  await page.locator(`button[aria-label="${viewport.label}"]`).click();
  // Let the iframe settle at its new width before measuring.
  await page.waitForTimeout(1200);

  const frame = page
    .frames()
    .find((candidate) => candidate.url().includes("/homepage/preview"));

  if (!frame) {
    console.log(`FAIL ${viewport.name}: preview frame not found`);
    failures += 1;
    continue;
  }

  const measured = await frame.evaluate(() => ({
    innerWidth: window.innerWidth,
    // Exactly Tailwind's `lg:` breakpoint. If this reports true at mobile
    // width, the iframe is not driving the breakpoints.
    lgMatches: window.matchMedia("(min-width: 1024px)").matches,
  }));

  const ok = measured.lgMatches === viewport.lgMustMatch;
  if (!ok) {
    failures += 1;
  }
  console.log(
    `${ok ? "PASS" : "FAIL"} ${viewport.name}: innerWidth=${measured.innerWidth} lgMatches=${measured.lgMatches} (expected ${viewport.lgMustMatch})`,
  );

  await page.screenshot({
    path: `${outDir}/homepage-workspace-${viewport.name}.png`,
    animations: "disabled",
  });
}
} finally {
  await browser.close();
}

if (failures > 0) {
  console.error(`\n${failures} viewport check(s) failed.`);
  process.exit(1);
}
console.log("\nAll viewport checks passed.");
