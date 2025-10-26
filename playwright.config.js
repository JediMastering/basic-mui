
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  globalSetup: './tests-e2e/global.setup.js',
  // Adiciona setup de cobertura quando COVERAGE=true
  ...(process.env.COVERAGE === 'true' && {
    globalTeardown: './tests-e2e/coverage.teardown.js',
  }),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000, // 30 segundos por teste (padrão do Playwright)
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    storageState: 'playwright/.auth/user.json',
    actionTimeout: 5000, // 5 segundos para ações
    navigationTimeout: 10000, // 10 segundos para navegação
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // Descomente a linha abaixo apenas para debug manual (torna os testes muito lentos):
      // use: { ...devices['Desktop Chrome'], launchOptions: { slowMo: 500 } },
    },
  ],
});
