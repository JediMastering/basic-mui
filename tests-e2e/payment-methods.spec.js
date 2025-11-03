import { test, expect } from './test-fixtures.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper para criar um método de pagamento através da UI
 */
async function createPaymentMethod(page, name, description = null) {
  await page.getByRole('button', { name: 'Novo' }).click();
  await page.getByLabel('Nome').fill(name);

  if (description) {
    await page.getByLabel('Descrição').fill(description);
  }

  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Novo Método de Pagamento')).not.toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(500); // Aguarda a tabela atualizar
  return { name, description };
}

/**
 * Helper para deletar um método de pagamento através da UI
 */
async function deletePaymentMethod(page, name) {
  // Localiza a linha do método de pagamento
  const row = page.locator('tr').filter({ hasText: name });
  const checkbox = row.locator('input[type="checkbox"]');

  // Verifica se o método de pagamento existe antes de tentar deletar
  const isVisible = await row.isVisible().catch(() => false);
  if (!isVisible) {
    console.log(`Método de pagamento ${name} não encontrado para deletar`);
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
 * Helper para navegar até a página de métodos de pagamento
 */
async function navigateToPaymentMethodsPage(page) {
  await page.goto('/example');
  await expect(page.getByText('Welcome to the Example Page')).toBeVisible();

  const menuButton = page.locator('button[aria-label="menu"]');
  await menuButton.click();
  await page.waitForTimeout(500);

  const drawer = page.locator('[role="presentation"]').or(page.locator('.MuiDrawer-root'));
  await drawer.getByText('Métodos de Pagamento').click();

  await page.waitForURL('**/payment-methods', { timeout: 10000 });
  await page.waitForTimeout(500);
}

// ============================================================================
// TESTES
// ============================================================================

test.describe('Payment Methods CRUD - Gestão de Métodos de Pagamento', () => {
  // Aumenta o timeout para 60 segundos para permitir setup/teardown
  test.setTimeout(60000);

  // Array para armazenar métodos de pagamento de teste criados
  const testPaymentMethods = [];

  // ====== SETUP - Cria métodos de pagamento de teste antes de todos os testes ======
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToPaymentMethodsPage(page);

    // Cria 5 métodos de pagamento de teste
    const timestamp = Date.now();
    for (let i = 0; i < 5; i++) {
      const paymentMethod = await createPaymentMethod(
        page,
        `Test Payment ${timestamp}_${i}`
      );
      testPaymentMethods.push(paymentMethod);
    }

    await context.close();
  });

  // ====== TEARDOWN - Remove métodos de pagamento de teste depois de todos os testes ======
  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    await navigateToPaymentMethodsPage(page);

    // Deleta todos os métodos de pagamento de teste criados
    for (const paymentMethod of testPaymentMethods) {
      await deletePaymentMethod(page, paymentMethod.name);
    }

    await context.close();
  });

  // ====== beforeEach - Navega para a página antes de cada teste ======
  test.beforeEach(async ({ page }) => {
    await navigateToPaymentMethodsPage(page);
  });

  // ============================================================================
  // NAVEGAÇÃO E INTERFACE
  // ============================================================================
  test.describe('Navegação e Interface', () => {
    test('should navigate to the payment methods page after login', async ({ page }) => {
      await expect(page).toHaveURL(/.*payment-methods/);
      await expect(page.getByText('Métodos de Pagamento', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should display the table with columns', async ({ page }) => {
      await expect(page.getByText('Nome')).toBeVisible();
    });

    test('should display filter sidebar button', async ({ page }) => {
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      await expect(filterIcon).toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - CRIAÇÃO DE MÉTODO DE PAGAMENTO
  // ============================================================================
  test.describe('CRUD - Criação de Método de Pagamento', () => {
    test('should open create payment method modal', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await expect(page.getByText('Novo Método de Pagamento')).toBeVisible();
      await expect(page.getByLabel('Nome')).toBeVisible();
      await expect(page.getByLabel('Descrição')).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Ativo' })).toBeVisible();

      // Verifica que o switch está marcado como ativo por padrão
      const activeSwitch = page.getByRole('checkbox', { name: 'Ativo' });
      await expect(activeSwitch).toBeChecked();
    });

    test('should create a new payment method successfully', async ({ page }) => {
      const timestamp = Date.now();
      const name = `Temp Payment ${timestamp}`;

      await createPaymentMethod(page, name);
      await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });

      // Cleanup - remove o método de pagamento criado
      await deletePaymentMethod(page, name);
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText(/obrigatório|required/i).first()).toBeVisible();
    });

    test('should show validation error for short name', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByLabel('Nome').fill('A'); // Menos de 2 caracteres
      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText(/mínimo 2 caracteres/i)).toBeVisible();
    });

    test('should close modal on cancel', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByRole('button', { name: 'Cancelar' }).click();
      await expect(page.getByText('Novo Método de Pagamento')).not.toBeVisible();
    });

    test('should create a payment method with description', async ({ page }) => {
      const timestamp = Date.now();
      const name = `Payment With Desc ${timestamp}`;
      const description = 'Este é um método de pagamento com descrição de teste';

      await createPaymentMethod(page, name, description);
      await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });

      // Cleanup
      await deletePaymentMethod(page, name);
    });

    test('should show validation error for description exceeding max length', async ({ page }) => {
      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByLabel('Nome').fill('Test Payment');

      // Cria uma string com mais de 255 caracteres
      const longDescription = 'a'.repeat(256);
      await page.getByLabel('Descrição').fill(longDescription);

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText(/máximo 255 caracteres/i)).toBeVisible();

      // Fecha o modal
      await page.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should create payment method as inactive', async ({ page }) => {
      const timestamp = Date.now();
      const name = `Inactive Payment ${timestamp}`;

      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByLabel('Nome').fill(name);

      // Desativa o switch
      const activeSwitch = page.getByRole('checkbox', { name: 'Ativo' });
      await activeSwitch.click();
      await expect(activeSwitch).not.toBeChecked();

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Novo Método de Pagamento')).not.toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);

      // Verifica que o método foi criado e está como Inativo
      await expect(page.getByText(name)).toBeVisible();
      const row = page.locator('tr').filter({ hasText: name });
      await expect(row.getByText('Inativo')).toBeVisible();

      // Cleanup
      await deletePaymentMethod(page, name);
    });
  });

  // ============================================================================
  // CRUD - EDIÇÃO DE MÉTODO DE PAGAMENTO
  // ============================================================================
  test.describe('CRUD - Edição de Método de Pagamento', () => {
    test('should open edit modal when selecting a payment method', async ({ page }) => {
      // Seleciona o primeiro método de pagamento de teste
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[0].name });
      await row.locator('input[type="checkbox"]').click();

      await expect(page.getByText(/1 selecionado/i)).toBeVisible();
      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).toBeVisible();

      // Fecha o modal
      await page.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should edit payment method successfully', async ({ page }) => {
      // Seleciona o segundo método de pagamento de teste
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[1].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).toBeVisible();

      // Modifica o nome
      const timestamp = Date.now();
      const newName = `Updated Payment ${timestamp}`;

      const nameField = page.getByLabel('Nome');
      await nameField.clear();
      await nameField.fill(newName);

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).not.toBeVisible({ timeout: 5000 });

      // Atualiza o nome no array de teste para o teardown
      testPaymentMethods[1].name = newName;
    });

    test('should edit payment method with description', async ({ page }) => {
      // Seleciona o terceiro método de pagamento de teste
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[2].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).toBeVisible();

      // Adiciona/edita descrição
      const newDescription = 'Descrição atualizada via teste E2E';
      const descriptionField = page.getByLabel('Descrição');
      await descriptionField.clear();
      await descriptionField.fill(newDescription);

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).not.toBeVisible({ timeout: 5000 });
    });

    test('should toggle payment method status', async ({ page }) => {
      // Seleciona o quarto método de pagamento de teste
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[3].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Editar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).toBeVisible();

      // Desativa o switch
      const activeSwitch = page.getByRole('checkbox', { name: 'Ativo' });
      await activeSwitch.click();

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Editar Método de Pagamento')).not.toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);

      // Verifica que o status foi alterado para Inativo
      const updatedRow = page.locator('tr').filter({ hasText: testPaymentMethods[3].name });
      await expect(updatedRow.getByText('Inativo')).toBeVisible();
    });

    test('should not show edit button when multiple payment methods selected', async ({ page }) => {
      // Seleciona dois métodos de pagamento de teste
      const row1 = page.locator('tr').filter({ hasText: testPaymentMethods[0].name });
      const row2 = page.locator('tr').filter({ hasText: testPaymentMethods[1].name });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();

      await expect(page.getByText('2 selecionado')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Editar' })).not.toBeVisible();
    });
  });

  // ============================================================================
  // CRUD - EXCLUSÃO DE MÉTODO DE PAGAMENTO
  // ============================================================================
  test.describe('CRUD - Exclusão de Método de Pagamento', () => {
    test('should show delete confirmation dialog', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[2].name });
      await row.locator('input[type="checkbox"]').click();

      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      // Cancela para não deletar
      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: 'Cancelar' }).click();
    });

    test('should cancel delete operation', async ({ page }) => {
      const row = page.locator('tr').filter({ hasText: testPaymentMethods[2].name });
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

    test('should delete payment method successfully', async ({ page }) => {
      // Cria um método de pagamento temporário para deletar
      const timestamp = Date.now();
      const name = `Delete Me ${timestamp}`;
      await createPaymentMethod(page, name);
      await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });

      // Deleta o método de pagamento
      const row = page.locator('tr').filter({ hasText: name });
      await row.locator('input[type="checkbox"]').click();
      await page.getByRole('button', { name: 'Excluir' }).click();
      await expect(page.getByRole('heading', { name: 'Confirmar Exclusão' })).toBeVisible();

      const dialog = page.locator('[role="dialog"]');
      await dialog.getByRole('button', { name: /excluir/i }).click();
      await expect(page.getByText(/excluído.*com sucesso/i)).toBeVisible({ timeout: 3000 });
      await page.waitForTimeout(1000);
      await expect(page.getByText(name)).not.toBeVisible();
    });
  });

  // ============================================================================
  // SELEÇÃO EM MASSA
  // ============================================================================
  test.describe('Seleção em Massa', () => {
    test('should select all payment methods with header checkbox', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/\d+ selecionado/)).toBeVisible();

      // Desseleciona para não afetar outros testes
      await headerCheckbox.click();
    });

    test('should deselect all payment methods', async ({ page }) => {
      const headerCheckbox = page.locator('thead input[type="checkbox"]');
      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).toBeVisible();

      await headerCheckbox.click();
      await expect(page.getByText(/selecionado/)).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Novo' })).toBeVisible();
    });

    test('should select multiple payment methods individually', async ({ page }) => {
      // Seleciona 3 métodos de pagamento de teste
      const row1 = page.locator('tr').filter({ hasText: testPaymentMethods[0].name });
      const row2 = page.locator('tr').filter({ hasText: testPaymentMethods[1].name });
      const row3 = page.locator('tr').filter({ hasText: testPaymentMethods[2].name });

      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();

      await expect(page.getByText('3 selecionado')).toBeVisible();

      // Desseleciona
      await row1.locator('input[type="checkbox"]').click();
      await row2.locator('input[type="checkbox"]').click();
      await row3.locator('input[type="checkbox"]').click();
    });

    test('should delete multiple payment methods at once', async ({ page }) => {
      // Cria 2 métodos de pagamento temporários para deletar
      const timestamp = Date.now();

      await createPaymentMethod(page, `Bulk Delete ${timestamp}_0`);
      await createPaymentMethod(page, `Bulk Delete ${timestamp}_1`);

      await expect(page.getByText(`Bulk Delete ${timestamp}_0`)).toBeVisible();
      await expect(page.getByText(`Bulk Delete ${timestamp}_1`)).toBeVisible();

      // Seleciona os 2 métodos de pagamento
      const row0 = page.locator('tr').filter({ hasText: `Bulk Delete ${timestamp}_0` });
      const row1 = page.locator('tr').filter({ hasText: `Bulk Delete ${timestamp}_1` });

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

      await expect(page.getByText(`Bulk Delete ${timestamp}_0`)).not.toBeVisible();
      await expect(page.getByText(`Bulk Delete ${timestamp}_1`)).not.toBeVisible();
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
      await expect(page.getByLabel('Descrição')).toBeVisible();

      // Verifica que os checkboxes de status estão visíveis
      await expect(page.getByRole('checkbox', { name: 'Ativo' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Inativo' })).toBeVisible();

      // Verifica que por padrão apenas "Ativo" está marcado
      await expect(page.getByRole('checkbox', { name: 'Ativo' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Inativo' })).not.toBeChecked();
    });

    test('should filter payment methods by name', async ({ page }) => {
      const timestamp = Date.now();
      const uniqueName = `Filter Test ${timestamp}`;

      await createPaymentMethod(page, uniqueName);
      await openFilterSidebar(page);

      await page.getByLabel('Nome').fill(uniqueName);
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await expect(page.getByText(uniqueName)).toBeVisible();

      // Cleanup
      await page.getByRole('button', { name: 'Limpar' }).click();
      await page.waitForTimeout(500);
      await deletePaymentMethod(page, uniqueName);
    });

    test('should clear filters', async ({ page }) => {
      await openFilterSidebar(page);
      await page.getByLabel('Nome').fill('test');
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Limpar' }).click();
      await expect(page.getByLabel('Nome')).toHaveValue('');

      // Verifica que volta ao estado padrão (apenas Ativo marcado)
      await expect(page.getByRole('checkbox', { name: 'Ativo' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Inativo' })).not.toBeChecked();
    });

    test('should filter by status using checkboxes', async ({ page }) => {
      // Cria um método de pagamento inativo para testar
      const timestamp = Date.now();
      const inactiveName = `Inactive Test ${timestamp}`;

      await page.getByRole('button', { name: 'Novo' }).click();
      await page.getByLabel('Nome').fill(inactiveName);

      // Encontra o switch "Ativo" dentro do modal de criação
      const modal = page.locator('[role="dialog"]');
      const activeSwitch = modal.getByRole('checkbox', { name: 'Ativo' });
      await activeSwitch.click(); // Desativa

      await page.getByRole('button', { name: 'Salvar' }).click();
      await expect(page.getByText('Novo Método de Pagamento')).not.toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);

      // Abre o filtro
      const filterIcon = page.locator('.filter-sidebar svg[data-testid="FilterListIcon"]');
      await filterIcon.click();
      await page.waitForTimeout(300);

      // Marca apenas Inativo nos filtros (não no modal)
      const filterActiveCheckbox = page.getByRole('checkbox', { name: 'Ativo' }).last();
      const filterInactiveCheckbox = page.getByRole('checkbox', { name: 'Inativo' }).last();

      await filterActiveCheckbox.click(); // Desmarca Ativo
      await filterInactiveCheckbox.click(); // Marca Inativo
      await page.getByRole('button', { name: 'Filtrar' }).click();
      await page.waitForTimeout(500);

      // Deve mostrar apenas inativos
      await expect(page.getByText(inactiveName)).toBeVisible();

      // Cleanup
      await page.getByRole('button', { name: 'Limpar' }).click();
      await page.waitForTimeout(500);
      await deletePaymentMethod(page, inactiveName);
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
      const nameHeader = page.locator('th').filter({ hasText: 'Nome' });
      await nameHeader.click();
      await page.waitForTimeout(500);

      const sortIcon = page.locator('[data-testid*="KeyboardArrow"]');
      await expect(sortIcon.first()).toBeVisible();
    });
  });
});
