import { test, expect } from './test-fixtures.js';

test.describe('ExamplePage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/example');
  });

  test('should display the example page with correct title and content', async ({ page }) => {
    // Verifica o título principal
    await expect(page.getByRole('heading', { name: 'Welcome to the Example Page' })).toBeVisible();

    // Verifica a seção de Layout Features
    await expect(page.getByRole('heading', { name: 'Layout Features' })).toBeVisible();
    await expect(page.getByText('This page demonstrates the improved layout with:')).toBeVisible();

    // Verifica a seção de Actions
    await expect(page.getByRole('heading', { name: 'Actions' })).toBeVisible();
  });

  test('should display action buttons', async ({ page }) => {
    // Verifica que os botões de ação existem e estão visíveis
    await expect(page.getByRole('button', { name: 'Toggle Sidebar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sample Action' })).toBeVisible();
  });

  test('should have clickable sample action button', async ({ page }) => {
    const sampleButton = page.getByRole('button', { name: 'Sample Action' });

    // Verifica que o botão está habilitado
    await expect(sampleButton).toBeEnabled();

    // Clica no botão (não quebra mesmo sem verificar console.log)
    await sampleButton.click();
  });

  test('should display layout features list', async ({ page }) => {
    // Verifica que existe uma lista (ul) com features
    const featuresList = page.locator('ul').first();
    await expect(featuresList).toBeVisible();

    // Verifica que tem pelo menos um item na lista
    const listItems = page.locator('ul li');
    await expect(listItems.first()).toBeVisible();
  });
});
