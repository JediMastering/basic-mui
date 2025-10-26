import { test, expect } from './test-fixtures.js';

test.describe('Password Reset', () => {
  test('should display forgot password page correctly', async ({ page }) => {
    await page.goto('/forgot-password');

    // Verifica título e descrição
    await expect(page.getByRole('heading', { name: 'Esqueci minha senha' })).toBeVisible();
    await expect(page.getByText('Informe seu e-mail para receber um link de redefinição de senha.')).toBeVisible();

    // Verifica campo de email e botão
    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar link de redefinição' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar para o login' })).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/forgot-password');

    // Preenche email inválido
    await page.getByLabel('E-mail').fill('email-invalido');
    await page.getByRole('button', { name: 'Enviar link de redefinição' }).click();

    // Verifica mensagem de validação
    await expect(page.getByText('Formato de e-mail inválido')).toBeVisible();
  });

  test('should submit forgot password form with valid email', async ({ page }) => {
    // Mock da API de forgot-password
    await page.route('**/api/forgot-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Se um usuário com este e-mail existir em nosso sistema, um link para redefinição de senha foi enviado.'
        }),
      });
    });

    await page.goto('/forgot-password');

    await page.getByLabel('E-mail').fill('test@example.com');
    await page.getByRole('button', { name: 'Enviar link de redefinição' }).click();

    // Verifica Snackbar de sucesso (role="alert")
    const successAlert = page.getByRole('alert').filter({ hasText: 'link para redefinição de senha foi enviado' });
    await expect(successAlert).toBeVisible({ timeout: 5000 });
  });

  test('should display error message on reset password page without token', async ({ page }) => {
    await page.goto('/reset-password');

    // Verifica mensagem de erro estática no Typography
    await expect(page.getByText('Link inválido. Por favor, solicite um novo link.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Solicitar novo link' })).toBeVisible();

    // Verifica que o botão está desabilitado
    await expect(page.getByRole('button', { name: 'Salvar nova senha' })).toBeDisabled();

    // Verifica Snackbar de erro
    const errorAlert = page.getByRole('alert').filter({ hasText: 'Token não encontrado' });
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
  });

  test('should display reset password form with valid token', async ({ page }) => {
    await page.goto('/reset-password?token=fake-token-123');

    // Verifica que a página carregou corretamente
    await expect(page.getByRole('heading', { name: 'Redefinir Senha' })).toBeVisible();

    // Verifica campos de senha usando name attribute (mais específico)
    await expect(page.locator('input[name="newPassword"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Verifica que o botão está habilitado com token
    await expect(page.getByRole('button', { name: 'Salvar nova senha' })).toBeEnabled();

    // Verifica que NÃO mostra mensagem de erro
    await expect(page.getByText('Link inválido. Por favor, solicite um novo link.')).not.toBeVisible();
  });

  test('should show validation error when passwords do not match', async ({ page }) => {
    await page.goto('/reset-password?token=fake-token-123');

    await page.locator('input[name="newPassword"]').fill('newpassword123');
    await page.locator('input[name="confirmPassword"]').fill('differentpassword');
    await page.getByRole('button', { name: 'Salvar nova senha' }).click();

    // Verifica mensagem de validação
    await expect(page.getByText('As senhas não conferem')).toBeVisible();
  });

  test('should reset password successfully with valid token', async ({ page }) => {
    // Mock da API de reset-password
    await page.route('**/api/reset-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Senha redefinida com sucesso'
        }),
      });
    });

    await page.goto('/reset-password?token=fake-token-123');

    await page.locator('input[name="newPassword"]').fill('NewPassword@123');
    await page.locator('input[name="confirmPassword"]').fill('NewPassword@123');
    await page.getByRole('button', { name: 'Salvar nova senha' }).click();

    // Verifica Snackbar de sucesso
    const successAlert = page.getByRole('alert').filter({ hasText: 'Sua senha foi redefinida com sucesso!' });
    await expect(successAlert).toBeVisible({ timeout: 5000 });
  });
});
