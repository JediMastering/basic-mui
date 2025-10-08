# 📘 Contexto do Projeto React – SaaS ERP Financeiro (Front-end)

## 🧩 Visão Geral

Este é o front-end de um **SaaS de controle financeiro para pessoas jurídicas**, desenvolvido em **React** com **Material UI (MUI)**.  
O objetivo é oferecer uma plataforma multiusuário (multi-tenant), onde cada usuário gerencia seus próprios dados financeiros de forma isolada.  
Futuramente será possível cadastrar múltiplas empresas por conta.

O sistema deve seguir **princípios de arquitetura limpa, componentização e boas práticas de programação moderna** em React, priorizando:
- Código limpo, legível e modular
- Separação clara de responsabilidades
- Tipagem forte (com TypeScript, caso usado)
- Uso consistente de hooks e contextos para estados globais
- Evitar repetição (DRY) e manter coesão entre módulos

---

## 🧱 Estrutura do Projeto

A estrutura base segue o padrão **modular por domínio**, com pastas independentes para cada área funcional.

src/
├── modules/
│ ├── user/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── validation/
│ │ ├── utils/
│ │ └── types/
│ │
│ └── finance/
│ ├── pages/
│ ├── components/
│ ├── hooks/
│ ├── services/
│ ├── validation/
│ ├── utils/
│ └── types/
│
├── shared/
│ ├── components/
│ ├── hooks/
│ ├── services/
│ ├── utils/
│ ├── validation/
│ └── types/
│
├── theme/
│ ├── mui/
│ │ ├── index.js # Wrapper Pattern de exportação MUI
│ │ ├── palette.js
│ │ ├── typography.js
│ │ └── overrides.js
│ │
│ └── ThemeProvider.jsx # Fornece o tema global com MUI ThemeProvider
│
├── routes/
│ └── AppRoutes.jsx
│
├── contexts/
│ ├── AuthContext.jsx
│ ├── ThemeContext.jsx
│ └── SnackbarContext.jsx
│
├── assets/
│ ├── images/
│ ├── icons/
│ └── styles/
│
├── config/
│ ├── axios.js
│ └── env.js
│
└── main.jsx


---

## 🎨 Padrão MUI – Wrapper Pattern

O projeto adota o **Wrapper Pattern** para o Material UI, de forma que **nenhum componente do MUI seja importado diretamente**.  
Todos os componentes devem ser importados a partir de um arquivo centralizado, garantindo consistência e facilidade de manutenção.

### 📁 `src/theme/mui/index.js`

```javascript
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
  FormGroup,
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
  SwipeableDrawer,
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

💡 Objetivo:
Manter um ponto único de controle sobre dependências MUI.
Se for necessário atualizar o MUI, ajustar estilos ou trocar a lib de UI, as alterações serão feitas apenas aqui, sem impacto direto nos módulos.

⚙️ Boas Práticas e Convenções

Usar funções puras e componentes funcionais

Adotar hooks personalizados para abstrair lógicas de negócio

Usar Context API ou Zustand/Recoil (se adotado) para estados globais

Evitar lógica de negócio em componentes de UI

Tipar todos os props e retornos (preferencialmente com TypeScript)

Reutilizar componentes genéricos em shared/components

Centralizar validações em validation/ e schemas (Yup ou Zod)

Centralizar requisições em services/ com axios

Respeitar o princípio Single Responsibility

Usar React Query ou outro client state lib moderna (opcional)

Seguir padronização de nomeação:

useSomething → Hooks

SomethingService → Serviços

SomethingValidator → Validações

SomethingUtils → Utilidades

Componentes MUI devem ser sempre importados do wrapper:

import { Button, Box } from '@/theme/mui';

🔒 Integração com o Back-end (Spring Boot)

A autenticação utiliza JWT.

As requisições usam o token Bearer, armazenado de forma segura (ex: httpOnly cookies ou Authorization header).

Os endpoints seguem convenções REST.

As respostas de erro devem seguir o padrão ErrorResponse do back-end.

Os dados paginados devem usar PaginationDTO.

🎯 Objetivo do Contexto

Este arquivo serve como documento de contexto para o Gemini, para que ele:

Entenda a arquitetura, convenções e boas práticas do front-end;

Gere código consistente com o padrão do projeto;

Sempre adote o Wrapper Pattern do MUI;

Priorize componentização, legibilidade e coesão;

Mantenha compatibilidade com o back-end Spring Boot do SaaS ERP.