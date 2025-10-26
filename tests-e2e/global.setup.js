
import { chromium, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

async function globalSetup(config) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL);

  // Aguarda página de login carregar
  await expect(page.getByLabel('Email')).toBeVisible({ timeout: 10000 });

  // Preenche credenciais
  await page.getByLabel('Email').fill('admin');
  await page.getByLabel('Senha').fill('password');

  // Clica em Entrar
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Aguarda redirecionamento para a página de exemplo (pode demorar um pouco)
  await page.waitForURL('**/example', { timeout: 15000 });

  // Verifica se o texto da página está visível
  await expect(page.getByText('Welcome to the Example Page')).toBeVisible({ timeout: 10000 });

  await page.context().storageState({ path: authFile });
  //await browser.close();
}

export default globalSetup;
