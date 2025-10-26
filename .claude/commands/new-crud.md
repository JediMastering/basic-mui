---
description: Criar CRUD completo com formulários, filtros e validação
---

Crie um CRUD completo e funcional seguindo todos os padrões do projeto, baseando-se no módulo de categorias como referência.

**O que fazer:**
1. Perguntar ao usuário:
   - Nome da entidade (ex: "produto", "cliente", "transação")
   - Campos da entidade (nome, tipo, obrigatório?)
   - Endpoint da API (se já existe)

2. Criar estrutura completa em `src/modules/[nome-entidade]/`:

   **pages/[Nome]ListPage.jsx:**
   - Página com SmartTable do framework
   - Botões: Novo, Editar, Excluir
   - Integração com FilterSidebar
   - DeleteConfirmationDialog
   - Seleção múltipla de registros
   - Usar o hook use[Nome] para lógica

   **components/[Nome]Form.jsx:**
   - Formulário com React Hook Form
   - Campos customizados do framework (Text, Number, etc)
   - Validação com Yup
   - Props: initialData, onSubmit, loading

   **components/[Nome]FormModal.jsx:**
   - Modal usando BaseFormModal do framework
   - Integra [Nome]Form
   - Controle de abertura/fechamento
   - Loading state

   **components/[Nome]FilterForm.jsx:**
   - Formulário de filtros
   - Botões: Filtrar, Limpar
   - Usa React Hook Form

   **hooks/use[Nome].js:**
   - useState para loading, error, data
   - Funções: fetchAll, create, update, delete
   - Integração com a API
   - Retorna: { data, loading, error, fetchAll, create, update, delete }

   **api/[nome]Api.js:**
   - Importa axios de 'service/api'
   - Funções: getAll, getById, create, update, deleteById
   - Retorna promises

   **validation/[nome]Validation.js:**
   - Schema Yup com todas as validações
   - Mensagens em português
   - Export: [nome]ValidationSchema

3. Adicionar rota em `src/service/Routes.jsx`:
   - Rota protegida para `/${nome-entidade}`

4. Perguntar se deseja criar testes E2E:
   - Se sim, criar `tests-e2e/[nome-entidade].spec.js`
   - Testes: navegação, criação, edição, exclusão, filtros, paginação
   - Importar de './test-fixtures.js'

**Padrões obrigatórios:**
- ✅ NUNCA importar direto de @mui/material (usar wrapper!)
- ✅ Usar componentes do framework (SmartTable, BaseFormModal, FilterSidebar)
- ✅ React Hook Form + Yup
- ✅ Componentização e separação de responsabilidades
- ✅ Nomenclatura consistente
- ✅ Código limpo e comentado
