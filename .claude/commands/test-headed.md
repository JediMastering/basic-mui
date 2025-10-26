---
description: Executar testes E2E com visualização no navegador
---

Execute os testes End-to-End em modo headed (com interface gráfica do navegador) para debug e visualização.

**Passos:**
1. Verificar se o servidor de desenvolvimento está rodando na porta 5173
2. Se não estiver, iniciar com `npm run dev` em background
3. Aguardar servidor ficar pronto
4. Executar testes com visualização: `npx playwright test --headed`
5. Informar ao usuário que ele pode visualizar a execução dos testes no navegador
