import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
const systemChrome =
  process.platform === "win32" &&
  existsSync("C:/Program Files/Google/Chrome/Application/chrome.exe");
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:5173",
    headless: true,
    trace: "retain-on-failure",
    channel:
      process.env.PLAYWRIGHT_BROWSER_CHANNEL ??
      (systemChrome ? "chrome" : undefined),
  },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
