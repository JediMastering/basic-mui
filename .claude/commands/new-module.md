---
description: Criar novo módulo seguindo o padrão do projeto
---

Crie um novo módulo de negócio completo seguindo a arquitetura modular do projeto.

**O que fazer:**
1. Perguntar ao usuário o nome do módulo (ex: "produto", "cliente", "fornecedor")
2. Criar a estrutura de pastas em `src/modules/[nome-modulo]/`:
   - `pages/` - Para as páginas do módulo
   - `components/` - Para componentes específicos
   - `hooks/` - Para hooks customizados
   - `api/` - Para chamadas à API
   - `validation/` - Para schemas Yup

**Padrões a seguir:**
- ✅ Usar Wrapper Pattern do MUI (nunca importar direto de @mui/material)
- ✅ Componentes funcionais com hooks
- ✅ React Hook Form + Yup para validação
- ✅ Nomenclatura: [Nome]Page, [Nome]Form, [Nome]FilterForm, use[Nome]
- ✅ Criar arquivos básicos:
  - `pages/[Nome]ListPage.jsx` - Página de listagem
  - `components/[Nome]Form.jsx` - Formulário
  - `components/[Nome]FilterForm.jsx` - Filtros
  - `hooks/use[Nome].js` - Hook customizado
  - `api/[nome]Api.js` - Serviço de API
  - `validation/[nome]Validation.js` - Schema Yup

3. Perguntar se deseja criar arquivos de teste E2E para o módulo
4. Se sim, criar em `tests-e2e/[nome-modulo].spec.js` importando de `./test-fixtures.js`
