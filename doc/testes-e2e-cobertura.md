# Testes E2E com Playwright e Cobertura de Código

Este documento descreve como executar os testes End-to-End (E2E) com Playwright e medir a cobertura de código da aplicação.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Modos de Execução](#modos-de-execução)
- [Testes COM Cobertura](#testes-com-cobertura)
- [Testes SEM Cobertura](#testes-sem-cobertura)
- [Visualizar Relatórios de Cobertura](#visualizar-relatórios-de-cobertura)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Garantia de Segurança em Produção](#garantia-de-segurança-em-produção)

---

## Pré-requisitos

Certifique-se de que todas as dependências estão instaladas:

```bash
npm install
```

## Modos de Execução

### Testes SEM Cobertura (Modo Normal)

Para executar os testes E2E no modo headless (sem interface gráfica):

```bash
npm run test:e2e
```

Para executar os testes E2E com interface gráfica (headed - visualizar no navegador):

```bash
npm run test:e2e:headed
```

> **Nota**: O modo headed é útil para debug e visualização da execução dos testes em tempo real.

---

## Testes COM Cobertura

Para executar os testes E2E **com cobertura de código**, siga os passos abaixo:

### Passo 1: Iniciar o Dev Server com Instrumentação

Abra um terminal e execute:

```bash
npm run dev:coverage
```

Este comando inicia o servidor de desenvolvimento com instrumentação de código para coleta de cobertura.

> **Importante**: Mantenha este terminal aberto durante a execução dos testes.

### Passo 2: Executar os Testes

Em **outro terminal**, execute os testes:

**Modo headless (sem interface gráfica):**
```bash
npm run test:e2e:coverage
```

**Modo headed (com interface gráfica - visualizar no navegador):**
```bash
COVERAGE=true npx playwright test --headed
```

> **Dica**: O modo headed com cobertura permite visualizar a execução dos testes enquanto a cobertura é coletada.

### Passo 3: Visualizar os Resultados

Ao final da execução, os relatórios de cobertura serão gerados automaticamente.

---

## Visualizar Relatórios de Cobertura

### Abrir Relatório HTML no Navegador

```bash
npm run coverage:open
```

Este comando abre o relatório de cobertura no seu navegador padrão.

### Localização dos Relatórios

Os relatórios de cobertura são gerados nas seguintes localizações:

- **HTML (interativo)**: `coverage/index.html`
- **LCOV (para CI/CD)**: `coverage/lcov.info`
- **JSON (resumo)**: `coverage/coverage-summary.json`

### Regenerar Relatórios

Se necessário, você pode regenerar os relatórios a partir dos dados coletados:

```bash
npm run coverage:report
```

---

## Estrutura de Arquivos

### Arquivos de Configuração

- `.nycrc.json` - Configuração do NYC para geração de relatórios
- `vite.config.js` - Plugin Istanbul condicional (só ativo com COVERAGE=true)
- `playwright.config.js` - Configuração do Playwright com teardown para relatórios
- `tests-e2e/test-fixtures.js` - Fixture customizado que coleta cobertura automaticamente
- `tests-e2e/coverage.teardown.js` - Script que gera relatórios ao final dos testes

### Arquivos Ignorados pelo Git

Os seguintes diretórios são automaticamente ignorados:

- `coverage/` - Relatórios de cobertura
- `.nyc_output/` - Dados brutos de cobertura

---

## Garantia de Segurança em Produção

### Build de Produção SEMPRE Limpo

O build de produção **NUNCA** contém instrumentação de código:

```bash
npm run build
```

Este comando **sempre** gera o `dist/` limpo, sem overhead de cobertura, mesmo em ambiente local.

### Como Funciona

A instrumentação de código **só é adicionada** quando:

1. A variável de ambiente `COVERAGE=true` está definida
2. Você executa explicitamente `npm run dev:coverage`

**É impossível acidentalmente enviar código instrumentado para produção**, pois seria necessário:
- Deliberadamente executar `COVERAGE=true npm run build`
- E então enviar esse dist específico para produção

---

## Comandos Rápidos (Cheat Sheet)

| Comando | Descrição |
|---------|-----------|
| `npm run test:e2e` | Testes E2E sem cobertura (headless) |
| `npm run test:e2e:headed` | Testes E2E sem cobertura (headed - visual) |
| `npm run dev:coverage` | Inicia dev server com instrumentação |
| `npm run test:e2e:coverage` | Executa testes com cobertura (headless) |
| `COVERAGE=true npx playwright test --headed` | Executa testes com cobertura (headed - visual) |
| `npm run coverage:report` | Regenera relatórios de cobertura |
| `npm run coverage:open` | Abre relatório HTML no navegador |
| `npm run build` | Build de produção (sempre limpo) |

---

## Métricas de Cobertura

O relatório de cobertura inclui as seguintes métricas:

- **Lines** (Linhas): Porcentagem de linhas executadas
- **Statements** (Declarações): Porcentagem de statements executados
- **Functions** (Funções): Porcentagem de funções chamadas
- **Branches** (Ramificações): Porcentagem de branches testados (if/else, switch, etc.)

### Configuração de Limites

Os limites de cobertura estão configurados em `.nycrc.json`:

```json
{
  "lines": 80,
  "statements": 80,
  "functions": 80,
  "branches": 80
}
```

Atualmente, a verificação de limites está desabilitada (`check-coverage: false`), mas pode ser ativada conforme necessário.

---

## Troubleshooting

### Problema: "Nenhum dado de cobertura encontrado"

**Solução**: Certifique-se de que o dev server foi iniciado com `npm run dev:coverage` antes de executar os testes.

### Problema: Servidor já está rodando na porta 5173

**Solução**: Pare todos os servidores Vite em execução:

```bash
pkill -f vite
```

Em seguida, reinicie o servidor com cobertura.

### Problema: Relatórios não estão sendo gerados

**Solução**: Execute manualmente o comando para gerar relatórios:

```bash
npx nyc report
```

---

## Referências

- [Playwright Documentation](https://playwright.dev/)
- [NYC (Istanbul) Documentation](https://github.com/istanbuljs/nyc)
- [Vite Plugin Istanbul](https://github.com/ifaxity/vite-plugin-istanbul)
