---
description: Executar testes E2E com cobertura de código
---

Execute os testes End-to-End com cobertura de código ativa.

**Passos:**
1. Verificar se há servidor Vite rodando e parar (pkill -f vite)
2. Iniciar servidor com instrumentação: `COVERAGE=true npm run dev` (em background)
3. Aguardar 5 segundos para o servidor iniciar
4. Executar testes: `COVERAGE=true npx playwright test`
5. Após os testes, matar o servidor
6. Mostrar resumo da cobertura do arquivo `coverage/coverage-summary.json`
7. Informar que o relatório HTML está em `coverage/index.html`
