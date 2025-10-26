import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hook que coleta cobertura após cada teste
test.afterEach(async ({ page }, testInfo) => {
  // Só coleta cobertura se COVERAGE=true
  if (process.env.COVERAGE !== 'true') {
    return;
  }

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
      console.log(`✓ Cobertura salva: ${path.basename(coverageFile)}`);
    }
  } catch (error) {
    console.warn('Aviso: Não foi possível coletar cobertura:', error.message);
  }
});
