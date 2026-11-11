import { defineConfig, devices } from "@playwright/test";
import config from "./playwright.config";

/** Safari 同类引擎的交互回归，单独运行以便按需安装 WebKit。 */
export default defineConfig({
  ...config,
  projects: [{ name: "webkit", use: { ...devices["Desktop Safari"] } }],
});
