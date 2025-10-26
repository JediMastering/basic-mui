import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Estende o test do Playwright com coleta automática de cobertura
export const test = base.extend({
  // Cria um fixture que automaticamente coleta cobertura
  page: async ({ page }, use, testInfo) => {
    // Usa a página normalmente durante o teste
    await use(page);

    // Após o teste, coleta a cobertura (só se COVERAGE=true)
    if (process.env.COVERAGE === 'true') {
      try {
        // Extrai os dados de cobertura do navegador
        const coverage = await page.evaluate(() => {
          return window.__coverage__;
        });

        if (coverage) {
          // Garante que o diretório .nyc_output existe
          const coverageDir = path.join(__dirname, '..', '.nyc_output');
          if (!fs.existsSync(coverageDir)) {
            fs.mkdirSync(coverageDir, { recursive: true });
          }

          // Salva a cobertura em um arquivo único por teste
          const testName = testInfo.titlePath.join('-').replace(/[^a-z0-9]/gi, '_');
          const coverageFile = path.join(
            coverageDir,
            `coverage-${testName}-${Date.now()}.json`
          );

          fs.writeFileSync(coverageFile, JSON.stringify(coverage));
          console.log(`    ✓ Cobertura salva`);
        }
      } catch (error) {
        console.warn('    ⚠️  Não foi possível coletar cobertura:', error.message);
      }
    }
  },
});

export { expect } from '@playwright/test';
