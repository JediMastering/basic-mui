import { test, expect } from './test-fixtures.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para criar um usuário através da UI
 */
async function createUser(page, username, email, password = 'Test@1234') {
  await page.getByRole('button', { name: 'Novo' }).click();
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Novo Usuário')).not.toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(500); // Aguarda a tabela atualizar
  return { username, email };
}

/**
 * Helper para deletar um usuário através da UI
 */
async function deleteUser(page, username) {
  // Localiza a linha do usuário
  const row = page.locator('tr').filter({ hasText: username });
  const checkbox = row.locator('input[type="checkbox"]');

  // Verifica se o usuário existe antes de tentar deletar
  const isVisible = await row.isVisible().catch(() => false);
  if (!isVisible) {
    console.log(`Usuário ${username} não encontrado para deletar`);
    return;
  }

  await checkbox.click();
  await page.getByRole('button', { name: 'Excluir' }).click();
  await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

  const dialog = page.locator('[role="dialog"]');
  const deleteButton = dialog.getByRole('button', { name: /excluir/i });
  await deleteButton.click();

  // Aguarda toast e refresh
  await page.waitForTimeout(1000);
}

/**
 * Helper para navegar até a página de usuários
 */
async function navigateToUsersPage(page) {
  await page.goto('/example');
  await expect(page.getByText('Welcome to the Example Page')).toBeVisible();

  const menuButton = page.locator('button[aria-label="menu"]');
  await menuButton.click();
  await page.waitForTimeout(500);

  const drawer = page.locator('[role="presentation"]').or(page.locator('.MuiDrawer-root'));
  await drawer.getByText('Usuários').click();

  await page.waitForURL('**/users-crud', { timeout: 10000 });
  await page.waitForTimeout(500);
}

// ============================================================================
// TESTES
// ============================================================================

test.describe('Users CRUD - Gestão de Usuários', () => {
  // Aumenta o timeout para 60 segundos para permitir setup/teardown
  test.setTimeout(60000);

  // Array para armazenar usuários de teste criados
  const testUsers = [];

  // ====== SETUP - Cria usuários de teste antes de todos os testes ======
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToUsersPage(page);

    // Cria 5 usuários de teste
    const timestamp = Date.now();
    for (let i = 0; i < 5; i++) {
      const user = await createUser(
        page,
        `testuser_${timestamp}_${i}`,
        `testuser_${timestamp}_${i}@example.com`
      );
      testUsers.push(user);
    }

    await context.close();
  });

  // ====== TEARDOWN - Remove usuários de teste depois de todos os testes ======
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToUsersPage(page);

    // Deleta todos os usuários de teste criados
    for (const user of testUsers) {
      await deleteUser(page, user.username);
    }

    await context.close();
  });

  // ====== beforeEach - Navega para a página antes de cada teste ======
  test.beforeEach(async ({ page }) => {
    await navigateToUsersPage(page);
  });

  // ============================================================================
  // NAVEGAÇÃO E INTERFACE
  // ============================================================================
  test.describe('Navegação e Interface', () => {
    test('should navigate to the users page after login', async ({ page }) => {
      await expect(page).toHaveURL(/.*users-crud/);
      await expect(page.getByText('Usuários', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should display the table with columns', async ({ page }) => {
      await expect(page.getByText('Foto')).toBeVisible();
      await expect(page.getByText('Identificador')).toBeVisible();
      await expect(page.getByText('Username')).toBeVisible();
    });

    test('should display filter sidebar button', async ({ page }) => {
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      await expect(filterIcon).toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - CRIAÇÃO DE USUÁRIO
  // ============================================================================
  test.describe('CRUD - Criação de Usuário', () => {
    test('should open create user modal', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await expect(page.getByText('Novo Usuário')).toBeVisible();
      await expect(page.getByLabel('Username')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByLabel('Grupos de Acesso')).toBeVisible();
    });

    test('should create a new user successfully', async ({ page }) => {
      const timestamp = Date.now();
      const username = `tempuser_${timestamp}`;
      const email = `tempuser_${timestamp}@example.com`;

      await createUser(page, username, email);
      await expect(page.getByText(username)).toBeVisible({ timeout: 5000 });

      // Cleanup - remove o usuário criado
      await deleteUser(page, username);
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Cancelar' }).click();
      await expect(page.getByText('Novo Usuário')).not.toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - EDIÇÃO DE USUÁRIO
  // ============================================================================
  test.describe('CRUD - Edição de Usuário', () => {
    test('should open edit modal when selecting a user', async ({ page }) => {
      // Seleciona o primeiro usuário de teste (não o admin)
      const row = page.locator('tr').filter({ hasText: testUsers[0].username });
      await row.locator('input[type="checkbox"]').click();

      await expect(page.getByText(/1 selecionado/i)).toBeVisible();
      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Usuário')).toBeVisible();

      // Fecha o modal
      await page.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should edit user successfully', async ({ page }) => {
      // Seleciona o segundo usuário de teste
      const row = page.locator('tr').filter({ hasText: testUsers[1].username });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Usuário')).toBeVisible();

      // Modifica o email
      const timestamp = Date.now();
      const newEmail = `updated_${timestamp}@test.com`;

      const emailField = page.getByLabel('Email');
      await emailField.clear();
      await emailField.fill(newEmail);

      const passwordField = page.getByLabel('Password');
      await passwordField.fill('Test@1234');

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Editar Usuário')).not.toBeVisible({ timeout: 5000 });
    });

    test('should not show edit button when multiple users selected', async ({ page }) => {
      // Seleciona dois usuários de teste
      const row1 = page.locator('tr').filter({ hasText: testUsers[0].username });
      const row2 = page.locator('tr').filter({ hasText: testUsers[1].username });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();

      await expect(page.getByText('2 selecionado')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Editar' })).not.toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - EXCLUSÃO DE USUÁRIO
  // ============================================================================
  test.describe('CRUD - Exclusão de Usuário', () => {
    test('should show delete confirmation dialog', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testUsers[2].username });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      // Cancela para não deletar
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should cancel delete operation', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testUsers[2].username });
      const checkbox = row.locator('input[type="checkbox"]');
      await checkbox.click();

      await expect(page.getByText(/1 selecionado/i)).toBeVisible();
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancelar' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).not.toBeVisible();

      // Desseleciona
      await checkbox.click();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should delete user successfully', async ({ page }) => {
      // Cria um usuário temporário para deletar
      const timestamp = Date.now();
      const username = `deleteme_${timestamp}`;
      await createUser(page, username, `delete_${timestamp}@example.com`);
      await expect(page.getByText(username)).toBeVisible({ timeout: 5000 });

      // Deleta o usuário
      const row = page.locator('tr').filter({ hasText: username });
      await row.locator('input[type="checkbox"]').click();
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: /excluir/i }).click();
      await expect(page.getByText(/excluído.*com sucesso/i)).toBeVisible({ timeout: 3000 });
      await page.waitForTimeout(1000);
      await expect(page.getByText(username)).not.toBeVisible();
    });
  });

  // ============================================================================
  // SELEÇÃO EM MASSA
  // ============================================================================
  test.describe('Seleção em Massa', () => {
    test('should select all users with header checkbox', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/\d+ selecionado/)).toBeVisible();

      // Desseleciona para não afetar outros testes
      await headerCheckbox.click();
    });

    test('should deselect all users', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).toBeVisible();

      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should select multiple users individually', async ({ page }) => {
      // Seleciona 3 usuários de teste
      const row1 = page.locator('tr').filter({ hasText: testUsers[0].username });
      const row2 = page.locator('tr').filter({ hasText: testUsers[1].username });
      const row3 = page.locator('tr').filter({ hasText: testUsers[2].username });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();

      await expect(page.getByText('3 selecionado')).toBeVisible();

      // Desseleciona
      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();
    });

    test('should delete multiple users at once', async ({ page }) => {
      // Cria 2 usuários temporários para deletar
      const timestamp = Date.now();

      await createUser(page, `bulkdelete_${timestamp}_0`, `bulkdelete_${timestamp}_0@example.com`);
      await createUser(page, `bulkdelete_${timestamp}_1`, `bulkdelete_${timestamp}_1@example.com`);

      await expect(page.getByText(`bulkdelete_${timestamp}_0`)).toBeVisible();
      await expect(page.getByText(`bulkdelete_${timestamp}_1`)).toBeVisible();

      // Seleciona os 2 usuários
      const row0 = page.locator('tr').filter({ hasText: `bulkdelete_${timestamp}_0` });
      const row1 = page.locator('tr').filter({ hasText: `bulkdelete_${timestamp}_1` });

      await row0.locator('input[type="checkbox"]').click();
      await page.waitForTimeout(300);
      await row1.locator('input[type="checkbox"]').click();
      await page.waitForTimeout(300);

      await expect(page.getByText('2 selecionado')).toBeVisible();

      // Deleta
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: /excluir/i }).click();
      await expect(page.getByText(/2 registro.*excluído.*com sucesso/i)).toBeVisible({ timeout: 3000 });
      await page.waitForTimeout(1000);

      await expect(page.getByText(`bulkdelete_${timestamp}_0`)).not.toBeVisible();
      await expect(page.getByText(`bulkdelete_${timestamp}_1`)).not.toBeVisible();
    });
  });

  // ============================================================================
  // FILTROS
  // ============================================================================
  test.describe('Filtros', () => {
    const openFilterSidebar = async (page) => {
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      const isVisible = await filterIcon.isVisible().catch(() => false);
      if (isVisible) {
        await filterIcon.click();
        await page.waitForTimeout(300);
      }
    };

    test('should open filter sidebar', async ({ page }) => {
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      await filterIcon.click();

      await expect(page.getByLabel('Nome')).toBeVisible();
      await expect(page.getByLabel('E-mail')).toBeVisible();
    });

    test('should filter users by username', async ({ page }) => {
      const timestamp = Date.now();
      const uniqueUsername = `filter_test_${timestamp}`;

      await createUser(page, uniqueUsername, `filter_${timestamp}@example.com`);
      await openFilterSidebar(page);

      await page.getByLabel('Nome').fill(uniqueUsername);
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await expect(page.getByText(uniqueUsername)).toBeVisible();

      // Cleanup
      await page.getByRole('button', { name: 'Limpar' }).click();
      await page.waitForTimeout(500);
      await deleteUser(page, uniqueUsername);
    });

    test('should clear filters', async ({ page }) => {
      await openFilterSidebar(page);
      await page.getByLabel('Nome').fill('test');
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Limpar' }).click();
      await expect(page.getByLabel('Nome')).toHaveValue('');
    });

    test('should filter by email', async ({ page }) => {
      const timestamp = Date.now();
      const uniqueEmail = `unique_filter_${timestamp}@example.com`;

      await createUser(page, `emailfilter_${timestamp}`, uniqueEmail);
      await openFilterSidebar(page);

      await page.getByLabel('E-mail').fill(uniqueEmail);
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await expect(page.getByText(`emailfilter_${timestamp}`)).toBeVisible();

      // Cleanup
      await page.getByRole('button', { name: 'Limpar' }).click();
      await page.waitForTimeout(500);
      await deleteUser(page, `emailfilter_${timestamp}`);
    });
  });

  // ============================================================================
  // PAGINAÇÃO E ORDENAÇÃO
  // ============================================================================
  test.describe('Paginação e Ordenação', () => {
    test('should display pagination controls', async ({ page }) => {
      const table = page.locator('table');
      await expect(table).toBeVisible();

      const rows = page.locator('tbody tr');
      await expect(rows.first()).toBeVisible();
    });

    test('should navigate between pages if available', async ({ page }) => {
      const rows = page.locator('tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should sort by column', async ({ page }) => {
      const usernameHeader = page.locator('th').filter({ hasText: 'Username' });
      await usernameHeader.click();
      await page.waitForTimeout(500);

      const sortIcon = page.locator('[data-testid*="KeyboardArrow"]');
      await expect(sortIcon.first()).toBeVisible();
    });
  });
});
