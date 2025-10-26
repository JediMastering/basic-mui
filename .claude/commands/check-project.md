---
description: Verificar saúde do projeto e identificar problemas comuns
---

Faça uma análise completa do projeto identificando problemas comuns e sugerindo correções.

**O que verificar:**

1. **Importações do MUI:**
   - Buscar imports diretos de `@mui/material`
   - Listar arquivos que não seguem o Wrapper Pattern
   - Sugerir correção com `/fix-mui-imports`

2. **Estrutura de arquivos:**
   - Verificar se módulos seguem a estrutura padrão
   - Identificar arquivos fora do padrão de nomenclatura
   - Verificar se há componentes duplicados

3. **Dependências:**
   - Verificar se `package.json` tem todas as dependências necessárias
   - Sugerir `npm audit` se houver vulnerabilidades
   - Verificar versões compatíveis

4. **Testes:**
   - Quantos testes E2E existem em `tests-e2e/`
   - Verificar se todos importam de `./test-fixtures.js`
   - Verificar se há arquivos de teste órfãos
   - Sugerir módulos sem testes

5. **Validações:**
   - Listar formulários que podem não ter validação
   - Verificar se schemas Yup estão em `validation/`
   - Sugerir campos sem validação

6. **Boas práticas React:**
   - Buscar `console.log` esquecidos
   - Buscar `useEffect` sem array de dependências
   - Identificar componentes muito grandes (>300 linhas)
   - Verificar se há lógica de negócio em componentes de UI

7. **Configuração de cobertura:**
   - Verificar se `.nycrc.json` existe
   - Verificar se `vite.config.js` tem plugin Istanbul
   - Verificar se `.gitignore` ignora `coverage/` e `.nyc_output/`

8. **Gerar relatório:**
   ```
   🔍 ANÁLISE DO PROJETO

   ✅ Tudo certo: X itens
   ⚠️  Atenção: X itens
   🔴 Problemas: X itens

   [Detalhes de cada categoria]

   💡 Sugestões de Ações:
   1. Execute `/fix-mui-imports` para corrigir importações
   2. Execute `/test-coverage` para verificar cobertura
   3. Adicione testes para módulos X, Y, Z
   ...
   ```

9. **Sugestões de melhorias:**
   - O que implementar a seguir
   - Onde melhorar a cobertura
   - Quais padrões reforçar
