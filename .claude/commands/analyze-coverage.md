---
description: Analisar cobertura de testes e sugerir melhorias
---

Analise a cobertura de código dos testes E2E e sugira onde adicionar mais testes.

**O que fazer:**

1. **Verificar se existe cobertura:**
   - Checar se existe o arquivo `coverage/coverage-summary.json`
   - Se não existir, informar que é necessário rodar `/test-coverage` primeiro

2. **Analisar métricas:**
   - Ler o arquivo JSON de cobertura
   - Identificar:
     - Cobertura total (lines, statements, functions, branches)
     - Top 5 arquivos com MELHOR cobertura (mostrar exemplos de boa prática)
     - Top 10 arquivos com PIOR cobertura (sugerir onde focar)
     - Arquivos com 0% de cobertura (prioridade alta)

3. **Gerar relatório:**
   ```
   📊 ANÁLISE DE COBERTURA

   ✅ Cobertura Geral:
   - Linhas: X%
   - Statements: X%
   - Funções: X%
   - Branches: X%

   🌟 Arquivos com Melhor Cobertura:
   1. arquivo1.jsx - 95%
   2. arquivo2.jsx - 90%
   ...

   ⚠️  Arquivos que Precisam de Mais Testes:
   1. arquivo1.jsx - 5%
   2. arquivo2.jsx - 10%
   ...

   🔴 Arquivos sem Cobertura (0%):
   - arquivo1.jsx
   - arquivo2.jsx
   ```

4. **Sugerir ações:**
   - Quais fluxos criar testes
   - Quais componentes testar
   - Se vale a pena criar testes unitários também

5. **Abrir relatório HTML:**
   - Perguntar se deseja abrir o relatório visual com `npm run coverage:open`
