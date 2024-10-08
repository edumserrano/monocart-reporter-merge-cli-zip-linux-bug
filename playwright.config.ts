import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { getMonocartReporterOptions } from "playwright.monocart-reporter-options";
import { reportersOutputDir, testsDir } from "playwright.shared-vars";
import { playwrightTestCommand } from "playwright.test-command";

export default defineConfig({
  testDir: testsDir,
  outputDir: path.resolve("./test-results"),
  fullyParallel: true,
  forbidOnly: !playwrightTestCommand.env.CI,
  retries: playwrightTestCommand.env.CI ? 2 : 0,
  workers: undefined,
  reporter: [
    ["list"],
    [
      "monocart-reporter",
      getMonocartReporterOptions(
        reportersOutputDir,
        playwrightTestCommand.isSharded,
        playwrightTestCommand.cliOptions.currentShard,
      ),
    ],
  ],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
