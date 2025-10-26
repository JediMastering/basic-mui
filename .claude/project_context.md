# 📘 Contexto do Projeto – SaaS ERP Financeiro (Front-end)

## 🧩 Visão Geral

Este é o front-end de um **SaaS de controle financeiro para pessoas jurídicas**, desenvolvido em **React** com **Material UI (MUI)**.

**Objetivos:**
- Plataforma multiusuário (multi-tenant)
- Cada usuário gerencia seus próprios dados financeiros de forma isolada
- Futuramente: cadastro de múltiplas empresas por conta
- Seguir princípios de arquitetura limpa, componentização e boas práticas

**Princípios Fundamentais:**
- Código limpo, legível e modular
- Separação clara de responsabilidades
- Uso consistente de hooks e contextos para estados globais
- Evitar repetição (DRY) e manter coesão entre módulos
- Respeitar o princípio Single Responsibility

---

## 🛠️ Stack Tecnológica

### Core
- **React 18** com Vite 6
- **Material-UI (MUI) v6** - Design System
- **React Router DOM v7** - Roteamento
- **React Hook Form 7** - Gerenciamento de formulários
- **Yup 1.6** - Validação de schemas

### Testes
- **Playwright 1.45** - Testes End-to-End (E2E)
- **Istanbul/NYC** - Cobertura de código
- **Vite Plugin Istanbul** - Instrumentação de código

### Utilitários
- **Axios 1.9** - Cliente HTTP
- **Day.js 1.11** - Manipulação de datas
- **Lodash 4.17** - Utilitários JavaScript

---

## 📁 Estrutura do Projeto

O projeto segue o padrão **modular por domínio**, com separação clara entre framework base e módulos de negócio.

```
src/
├── framework/              # Componentes base reutilizáveis (core do sistema)
│   ├── components/
│   │   ├── content/       # ExampleContent
│   │   ├── dialogs/       # DeleteConfirmationDialog
│   │   ├── fields/        # Text, Number (campos customizados)
│   │   ├── form/          # BaseFormModal
│   │   ├── header/        # ApplicationHeader
│   │   ├── navigation/    # NavigationSidebar
│   │   ├── sidebar/       # FilterSidebar
│   │   └── table/         # SmartTable, CrudTable
│   ├── hooks/             # useAppLayout, useExamplePage, useSnackbar
│   ├── layouts/           # AppLayout, ApplicationLayout
│   └── utils/             # connections.js (API utilities)
│
├── modules/               # Módulos de negócio (domínios isolados)
│   └── category/
│       ├── pages/         # CategoryListPage
│       ├── components/    # CategoryForm, CategoryFilterForm, CategorySelect
│       ├── hooks/         # useCategory
│       ├── api/           # categoryApi
│       └── validation/    # categoryValidation
│
├── pages/                 # Páginas principais e módulos avulsos
│   ├── ExamplePage.jsx
│   ├── Login.jsx
│   ├── auth/              # ForgotPassword, ResetPassword
│   ├── users/             # UsersCrudPage, UserForm, UserFilterForm
│   └── access-groups/     # AccessGroupCrudPage, AccessGroupForm
│
├── components/            # Componentes genéricos da aplicação
│   ├── NotFound.jsx
│   └── UserPhoto.jsx
│
├── service/               # Serviços globais
│   ├── api.js             # Configuração do Axios
│   ├── authService.js     # Serviços de autenticação
│   ├── Routes.jsx         # Definição de rotas
│   └── ProtectedRoute.jsx # Guard de rotas autenticadas
│
├── hooks/                 # Hooks globais
│   └── useMenuData.js     # Hook para dados do menu
│
├── mocks/                 # Dados mockados para desenvolvimento
│   ├── routes.js
│   └── data/              # accessGroups, menus, permissions, users
│
├── constants/             # Constantes da aplicação
│   └── examplePage.jsx
│
├── assets/                # Arquivos estáticos
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── config/                # Configurações
│   ├── axios.js
│   └── env.js
│
├── App.jsx                # Componente raiz
└── main.jsx               # Entry point

tests-e2e/                 # Testes End-to-End com Playwright
├── test-fixtures.js       # Fixture customizado com coleta de cobertura
├── global.setup.js        # Setup global (autenticação)
├── coverage.teardown.js   # Geração de relatórios de cobertura
├── dashboard.spec.js
├── categories.spec.js
├── users.spec.js
├── access-groups.spec.js
└── password-reset.spec.js

doc/                       # Documentação do projeto
└── testes-e2e-cobertura.md

.claude/                   # Contexto e comandos do Claude Code
└── project_context.md     # Este arquivo
```

---

## 🎨 Padrão Crítico: MUI Wrapper Pattern

**REGRA FUNDAMENTAL**: Nenhum componente do MUI deve ser importado diretamente de `@mui/material`.

### ❌ NUNCA FAÇA ISSO:
```javascript
import { Button, Box } from '@mui/material';  // ERRADO!
```

### ✅ SEMPRE FAÇA ISSO:
```javascript
import { Button, Box } from '@/theme/mui';  // CORRETO!
```

ou (no projeto atual, se aplicável):
```javascript
import { Button, Box } from 'framework/components/mui';  // CORRETO!
```

### 💡 Por quê?

O **Wrapper Pattern** garante:
1. **Controle centralizado** sobre dependências MUI
2. **Facilidade de manutenção** - mudanças em um único lugar
3. **Possibilidade de customização** global sem impacto nos componentes
4. **Facilidade de migração** - se mudar de biblioteca UI, ajusta apenas o wrapper
5. **Consistência** - todos os componentes usam a mesma fonte

### 📁 Estrutura do Wrapper (padrão ideal)

```javascript
// src/theme/mui/index.js
export {
  Alert,
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from '@mui/material';

export { ptBR } from '@mui/material/locale';
export { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
export { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
export { visuallyHidden } from '@mui/utils';
```

---

## 🧪 Testes E2E e Cobertura de Código

### Filosofia de Testes
- Testes E2E cobrem fluxos completos de usuário
- Cobertura de código mede o quanto do código é exercitado pelos testes
- **Build de produção SEMPRE limpo** (sem instrumentação)

### Comandos Essenciais

#### Testes SEM Cobertura (uso diário)
```bash
npm run test:e2e              # Headless (sem interface)
npm run test:e2e:headed       # Headed (visualizar no navegador)
```

#### Testes COM Cobertura (análise de qualidade)
```bash
# Terminal 1: Iniciar servidor com instrumentação
npm run dev:coverage

# Terminal 2: Executar testes
npm run test:e2e:coverage                      # Headless com cobertura
COVERAGE=true npx playwright test --headed     # Headed com cobertura
```

#### Visualizar Relatórios
```bash
npm run coverage:open         # Abre relatório HTML no navegador
npm run coverage:report       # Regenera relatórios
```

### Estrutura de Testes
- `tests-e2e/test-fixtures.js` - Fixture que coleta cobertura automaticamente
- `tests-e2e/global.setup.js` - Setup de autenticação
- `tests-e2e/coverage.teardown.js` - Gera relatórios ao final
- Todos os testes importam de `./test-fixtures.js` ao invés de `@playwright/test`

### Garantia de Segurança
```bash
npm run build  # SEMPRE gera dist limpo (sem instrumentação)
```

A instrumentação **só é ativada** com `COVERAGE=true` explícito.

**Documentação completa**: `doc/testes-e2e-cobertura.md`

---

## ⚙️ Boas Práticas e Convenções

### Componentização
1. **Componentes funcionais** - Sempre usar function components
2. **Hooks personalizados** - Abstrair lógicas de negócio em hooks
3. **Componentes puros** - Evitar side effects em componentes de UI
4. **Reutilização** - Componentes genéricos em `framework/` ou `shared/`

### Estado e Context
1. **Context API** para estados globais (Auth, Theme, Snackbar)
2. **Hooks locais** para estado de componente
3. **React Hook Form** para formulários
4. **Props drilling mínimo** - usar context quando necessário

### Validação e Formulários
1. **Yup schemas** em pasta `validation/`
2. **React Hook Form** com `@hookform/resolvers/yup`
3. **Validação no submit** e feedback visual imediato
4. **Campos customizados** em `framework/components/fields/`

### Serviços e API
1. **Axios** configurado em `service/api.js`
2. **Services** em pasta `api/` ou `services/` por módulo
3. **Tratamento de erros** centralizado
4. **JWT** em Authorization header
5. **Mocks** em `src/mocks/` para desenvolvimento

### Nomenclatura Padrão
- `useSomething` → Hooks
- `SomethingService` → Serviços
- `SomethingValidator` → Validações
- `SomethingUtils` → Utilitários
- `SomethingPage` → Páginas
- `SomethingForm` → Formulários
- `SomethingFilterForm` → Formulários de filtro
- `SomethingModal` → Modais

### Organização por Módulo
Cada módulo de negócio (ex: `category`, `user`) deve conter:
```
module/
├── pages/        # Páginas do módulo
├── components/   # Componentes específicos
├── hooks/        # Hooks específicos
├── api/          # Chamadas API
├── validation/   # Schemas Yup
├── utils/        # Utilitários (se necessário)
└── types/        # TypeScript types (se aplicável)
```

### Importações
```javascript
// ✅ CORRETO - Importar do wrapper
import { Button, Box } from '@/theme/mui';
import { TextField } from 'framework/components/fields';

// ❌ ERRADO - Importação direta
import { Button } from '@mui/material';
```

---

## 🔒 Integração com Back-end

### Autenticação
- **JWT** (JSON Web Token)
- Token armazenado em `Authorization: Bearer <token>`
- Rotas protegidas via `ProtectedRoute.jsx`
- Serviço de auth em `service/authService.js`

### API REST
- Endpoints seguem convenções REST
- Respostas de erro padronizadas (ErrorResponse)
- Dados paginados usando PaginationDTO
- Configuração do Axios em `service/api.js`

### Padrões de Resposta
```javascript
// Sucesso
{ data: {...}, message: "Success" }

// Erro
{ error: "Error message", code: 400 }

// Paginação
{
  content: [...],
  page: 0,
  size: 10,
  totalElements: 100,
  totalPages: 10
}
```

---

## 🎯 Diretrizes para Claude Code

Ao gerar código ou sugestões para este projeto:

1. ✅ **SEMPRE usar o Wrapper Pattern do MUI** - nunca importar diretamente de `@mui/material`
2. ✅ Seguir a estrutura modular por domínio
3. ✅ Criar componentes funcionais e hooks
4. ✅ Usar React Hook Form com Yup para validação
5. ✅ Colocar lógica de negócio em hooks e services
6. ✅ Manter componentes de UI puros e simples
7. ✅ Seguir convenções de nomenclatura
8. ✅ Componentizar tudo que for reutilizável em `framework/`
9. ✅ Testes E2E devem importar de `./test-fixtures.js`
10. ✅ Documentar decisões importantes em comentários
11. ✅ Priorizar legibilidade e manutenibilidade
12. ✅ Respeitar o princípio Single Responsibility
13. ✅ Garantir que builds de produção nunca tenham instrumentação de cobertura
14. ✅ Usar português para nomes de variáveis e comentários quando apropriado

---

## 📚 Referências Importantes

- **Documentação MUI**: https://mui.com/
- **React Hook Form**: https://react-hook-form.com/
- **Playwright**: https://playwright.dev/
- **Vite**: https://vitejs.dev/
- **Testes E2E**: Ver `doc/testes-e2e-cobertura.md`

---

## 🔄 Status do Projeto

**Módulos Implementados:**
- ✅ Autenticação (Login, Forgot Password, Reset Password)
- ✅ Usuários (CRUD completo)
- ✅ Grupos de Acesso (CRUD completo)
- ✅ Categorias (CRUD completo com filtros)
- ✅ Framework base (tabelas, formulários, sidebars, dialogs)
- ✅ Testes E2E com Playwright
- ✅ Cobertura de código com Istanbul/NYC

**Próximos Passos:**
- Implementar módulos financeiros (transações, contas, etc.)
- Expandir cobertura de testes
- Adicionar TypeScript gradualmente
- Implementar internacionalização (i18n)

---

*Este documento serve como contexto permanente para o Claude Code, garantindo consistência e aderência aos padrões do projeto.*
