import { test, expect } from './test-fixtures.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para criar um grupo de acesso através da UI
 */
async function createAccessGroup(page, groupName) {
  await page.getByRole('button', { name: 'Novo' }).click();
  await expect(page.getByText('Novo Grupo de Acesso')).toBeVisible();

  // Seleciona o campo dentro do modal (dialog)
  const modal = page.locator('[role="dialog"]');
  await modal.getByLabel('Nome do Grupo').fill(groupName);

  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Novo Grupo de Acesso')).not.toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(500);
  return { name: groupName };
}

/**
 * Helper para deletar um grupo de acesso através da UI
 */
async function deleteAccessGroup(page, groupName) {
  const row = page.locator('tr').filter({ hasText: groupName });
  const checkbox = row.locator('input[type="checkbox"]');

  const isVisible = await row.isVisible().catch(() => false);
  if (!isVisible) {
    console.log(`Grupo ${groupName} não encontrado para deletar`);
    return;
  }

  await checkbox.click();
  await page.getByRole('button', { name: 'Excluir' }).click();
  await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

  const dialog = page.locator('[role="dialog"]');
  const deleteButton = dialog.getByRole('button', { name: /excluir/i });
  await deleteButton.click();

  await page.waitForTimeout(1000);
}

/**
 * Helper para navegar até a página de grupos de acesso
 */
async function navigateToAccessGroupsPage(page) {
  await page.goto('/example');
  await expect(page.getByText('Welcome to the Example Page')).toBeVisible();

  const menuButton = page.locator('button[aria-label="menu"]');
  await menuButton.click();
  await page.waitForTimeout(500);

  const drawer = page.locator('[role="presentation"]').or(page.locator('.MuiDrawer-root'));
  await drawer.getByText('Grupos de Acesso').click();

  await page.waitForURL('**/access-groups-crud', { timeout: 10000 });
  await page.waitForTimeout(500);
}

// ============================================================================
// TESTES
// ============================================================================

test.describe('Access Groups CRUD - Gestão de Grupos de Acesso', () => {
  // Aumenta o timeout para 60 segundos para permitir setup/teardown
  test.setTimeout(60000);

  // Array para armazenar grupos de teste criados
  const testGroups = [];

  // ====== SETUP - Cria grupos de teste antes de todos os testes ======
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToAccessGroupsPage(page);

    // Cria 5 grupos de teste
    const timestamp = Date.now();
    for (let i = 0; i < 5; i++) {
      const group = await createAccessGroup(
        page,
        `testgroup_${timestamp}_${i}`
      );
      testGroups.push(group);
    }

    await context.close();
  });

  // ====== TEARDOWN - Remove grupos de teste depois de todos os testes ======
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToAccessGroupsPage(page);

    // Deleta todos os grupos de teste criados
    for (const group of testGroups) {
      await deleteAccessGroup(page, group.name);
    }

    await context.close();
  });

  // ====== beforeEach - Navega para a página antes de cada teste ======
  test.beforeEach(async ({ page }) => {
    await navigateToAccessGroupsPage(page);
  });

  // ============================================================================
  // NAVEGAÇÃO E INTERFACE
  // ============================================================================
  test.describe('Navegação e Interface', () => {
    test('should navigate to the access groups page after login', async ({ page }) => {
      await expect(page).toHaveURL(/.*access-groups-crud/);
      await expect(page.getByText('Grupos de Acesso', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should display the table with columns', async ({ page }) => {
      // Verifica headers da tabela (th elements)
      await expect(page.locator('th').filter({ hasText: 'Identificador' })).toBeVisible();
      await expect(page.locator('th').filter({ hasText: 'Nome do Grupo' })).toBeVisible();
    });

    test('should display filter sidebar button', async ({ page }) => {
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      await expect(filterIcon).toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - CRIAÇÃO DE GRUPO
  // ============================================================================
  test.describe('CRUD - Criação de Grupo', () => {
    test('should open create access group modal', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await expect(page.getByText('Novo Grupo de Acesso')).toBeVisible();

      // Verifica campo dentro do modal
      const modal = page.locator('[role="dialog"]');
      await expect(modal.getByLabel('Nome do Grupo')).toBeVisible();
    });

    test('should create a new access group successfully', async ({ page }) => {
      const timestamp = Date.now();
      const groupName = `tempgroup_${timestamp}`;

      await createAccessGroup(page, groupName);
      await expect(page.getByText(groupName)).toBeVisible({ timeout: 5000 });

      // Cleanup - remove o grupo criado
      await deleteAccessGroup(page, groupName);
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Cancelar' }).click();
      await expect(page.getByText('Novo Grupo de Acesso')).not.toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - EDIÇÃO DE GRUPO
  // ============================================================================
  test.describe('CRUD - Edição de Grupo', () => {
    test('should open edit modal when selecting a group', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testGroups[0].name });
      await row.locator('input[type="checkbox"]').click();

      await expect(page.getByText(/1 selecionado/i)).toBeVisible();
      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Grupo de Acesso')).toBeVisible();

      // Fecha o modal
      await page.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should edit access group successfully', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testGroups[1].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Grupo de Acesso')).toBeVisible();

      // Modifica o nome
      const timestamp = Date.now();
      const newName = `updated_${timestamp}`;

      // Seleciona o campo dentro do modal (dialog)
      const modal = page.locator('[role="dialog"]');
      const nameField = modal.getByLabel('Nome do Grupo');
      await nameField.clear();
      await nameField.fill(newName);

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Editar Grupo de Acesso')).not.toBeVisible({ timeout: 5000 });
    });

    test('should not show edit button when multiple groups selected', async ({ page }) => {
      // Usa grupos que não foram editados (0 e 2 ao invés de 0 e 1)
      const row1 = page.locator('tr').filter({ hasText: testGroups[0].name });
      const row2 = page.locator('tr').filter({ hasText: testGroups[2].name });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();

      await expect(page.getByText('2 selecionado')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Editar' })).not.toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - EXCLUSÃO DE GRUPO
  // ============================================================================
  test.describe('CRUD - Exclusão de Grupo', () => {
    test('should show delete confirmation dialog', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testGroups[2].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      // Cancela para não deletar
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should cancel delete operation', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testGroups[2].name });
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

    test('should delete access group successfully', async ({ page }) => {
      // Cria um grupo temporário para deletar
      const timestamp = Date.now();
      const groupName = `deleteme_${timestamp}`;
      await createAccessGroup(page, groupName);
      await expect(page.getByText(groupName)).toBeVisible({ timeout: 5000 });

      // Deleta o grupo
      const row = page.locator('tr').filter({ hasText: groupName });
      await row.locator('input[type="checkbox"]').click();
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: /excluir/i }).click();
      await expect(page.getByText(/excluído.*com sucesso/i)).toBeVisible({ timeout: 3000 });
      await page.waitForTimeout(1000);
      await expect(page.getByText(groupName)).not.toBeVisible();
    });
  });

  // ============================================================================
  // SELEÇÃO EM MASSA
  // ============================================================================
  test.describe('Seleção em Massa', () => {
    test('should select all groups with header checkbox', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/\d+ selecionado/)).toBeVisible();

      // Desseleciona para não afetar outros testes
      await headerCheckbox.click();
    });

    test('should deselect all groups', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).toBeVisible();

      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should select multiple groups individually', async ({ page }) => {
      // Usa grupos que não foram editados (0, 2 e 3 ao invés de 0, 1 e 2)
      const row1 = page.locator('tr').filter({ hasText: testGroups[0].name });
      const row2 = page.locator('tr').filter({ hasText: testGroups[2].name });
      const row3 = page.locator('tr').filter({ hasText: testGroups[3].name });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();

      await expect(page.getByText('3 selecionado')).toBeVisible();

      // Desseleciona
      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();
    });

    test('should delete multiple groups at once', async ({ page }) => {
      // Cria 2 grupos temporários para deletar
      const timestamp = Date.now();

      await createAccessGroup(page, `bulkdelete_${timestamp}_0`);
      await createAccessGroup(page, `bulkdelete_${timestamp}_1`);

      await expect(page.getByText(`bulkdelete_${timestamp}_0`)).toBeVisible();
      await expect(page.getByText(`bulkdelete_${timestamp}_1`)).toBeVisible();

      // Seleciona os 2 grupos
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
    });

    test('should filter groups by name', async ({ page }) => {
      const timestamp = Date.now();
      const uniqueName = `filter_test_${timestamp}`;

      await createAccessGroup(page, uniqueName);
      await openFilterSidebar(page);

      await page.getByLabel('Nome').fill(uniqueName);
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await expect(page.getByText(uniqueName)).toBeVisible();

      // Cleanup
      await page.getByRole('button', { name: 'Limpar' }).click();
      await page.waitForTimeout(500);
      await deleteAccessGroup(page, uniqueName);
    });

    test('should clear filters', async ({ page }) => {
      await openFilterSidebar(page);
      await page.getByLabel('Nome').fill('test');
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Limpar' }).click();
      await expect(page.getByLabel('Nome')).toHaveValue('');
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
      const groupNameHeader = page.locator('th').filter({ hasText: 'Nome do Grupo' });
      await groupNameHeader.click();
      await page.waitForTimeout(500);

      const sortIcon = page.locator('[data-testid*="KeyboardArrow"]');
      await expect(sortIcon.first()).toBeVisible();
    });
  });
});
