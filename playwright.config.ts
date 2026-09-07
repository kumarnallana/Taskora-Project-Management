import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90000, expect: { timeout: 15000 },
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    channel: process.platform === "win32" ? "msedge" : undefined,
    headless: true, actionTimeout: 15000,
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure"
  }
});
