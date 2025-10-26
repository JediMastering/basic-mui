---
description: Mostrar todos os comandos disponíveis do projeto
---

Liste todos os comandos personalizados disponíveis para este projeto com descrições e exemplos de uso.

**Comandos Disponíveis:**

## 🧪 Testes

**`/test-coverage`**
- Executar testes E2E com cobertura de código
- Inicia servidor instrumentado, roda testes, gera relatórios

**`/test-headed`**
- Executar testes E2E com visualização no navegador
- Útil para debug e ver os testes em ação

**`/analyze-coverage`**
- Analisar cobertura de testes e sugerir melhorias
- Identifica arquivos com baixa cobertura

## 🏗️ Desenvolvimento

**`/new-module [nome]`**
- Criar novo módulo seguindo o padrão do projeto
- Cria estrutura completa: pages, components, hooks, api, validation

**`/new-crud [nome]`**
- Criar CRUD completo funcional
- Inclui: listagem, formulários, filtros, validação, API, testes

**`/create-component [nome]`**
- Criar componente reutilizável no framework
- Categorias: fields, dialogs, table, content, sidebar, header, navigation

**`/add-validation [módulo]`**
- Adicionar ou melhorar validações Yup
- Inclui padrões brasileiros: CPF, CNPJ, CEP, telefone

## 🔧 Manutenção

**`/fix-mui-imports`**
- Corrigir importações do MUI para usar Wrapper Pattern
- Encontra e corrige imports diretos de @mui/material

**`/check-project`**
- Verificar saúde do projeto
- Identifica problemas comuns e sugere correções

**`/help`**
- Mostrar esta lista de comandos

---

## 📚 Exemplos de Uso:

```
/test-coverage
→ Executa testes com cobertura

/new-module produto
→ Cria módulo completo para "produto"

/new-crud cliente
→ Cria CRUD completo para "cliente"

/fix-mui-imports
→ Corrige todas as importações incorretas do MUI

/check-project
→ Analisa o projeto inteiro
```

---

## 💡 Dicas:

- Use `/test-headed` quando precisar debugar um teste
- Use `/check-project` antes de fazer um commit grande
- Use `/new-crud` ao invés de `/new-module` quando precisar de funcionalidade completa
- Execute `/analyze-coverage` periodicamente para manter boa cobertura de testes

---

Para mais informações sobre o projeto, veja:
- `.claude/project_context.md` - Contexto completo do projeto
- `doc/testes-e2e-cobertura.md` - Documentação de testes
- `docs/GEMINI_CONTEXT_REACT.md` - Padrões e convenções
