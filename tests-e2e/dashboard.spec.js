import { test, expect } from './test-fixtures.js';

test.describe('Dashboard', () => {
  test('should display the example page after login', async ({ page }) => {
    // Acessa a aplicação na página inicial após login
    await page.goto('/example');

    // Valida que o título da página está visível (Typography pode não ser reconhecido como heading)
    await expect(page.getByText('Welcome to the Example Page')).toBeVisible();
  });
});
