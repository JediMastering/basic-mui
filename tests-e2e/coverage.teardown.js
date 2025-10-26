import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalTeardown() {
  const nycOutputDir = path.join(__dirname, '..', '.nyc_output');

  // Verifica se há arquivos de cobertura
  if (!fs.existsSync(nycOutputDir)) {
    console.log('\n⚠️  Nenhum dado de cobertura encontrado');
    return;
  }

  const files = fs.readdirSync(nycOutputDir);
  if (files.length === 0) {
    console.log('\n⚠️  Nenhum arquivo de cobertura gerado');
    return;
  }

  console.log('\n📊 Gerando relatórios de cobertura...');

  try {
    // Gera os relatórios usando NYC
    await execAsync('npx nyc report', {
      cwd: path.join(__dirname, '..')
    });

    console.log('✓ Relatórios de cobertura gerados com sucesso!');
    console.log('  HTML: coverage/index.html');
    console.log('  LCOV: coverage/lcov.info');
  } catch (error) {
    console.error('✗ Erro ao gerar relatórios:', error.message);
  }
}

export default globalTeardown;
