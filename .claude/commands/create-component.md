---
description: Criar componente reutilizável no framework
---

Crie um componente reutilizável seguindo os padrões do framework base.

**O que fazer:**

1. **Perguntar ao usuário:**
   - Nome do componente (ex: "DatePicker", "ImageUpload", "StatusBadge")
   - Categoria do componente:
     - `fields/` - Campos de formulário
     - `dialogs/` - Diálogos/Modais
     - `table/` - Componentes de tabela
     - `content/` - Conteúdo genérico
     - `sidebar/` - Sidebars
     - `header/` - Headers
     - `navigation/` - Navegação
   - Props necessárias
   - Funcionalidade básica

2. **Criar componente em `src/framework/components/[categoria]/[Nome].jsx`:**

   **Estrutura padrão:**
   ```jsx
   import React from 'react';
   import { Box, Typography } from '@/theme/mui'; // WRAPPER!

   /**
    * [Descrição do componente]
    *
    * @param {Object} props - Propriedades do componente
    * @param {string} props.propName - Descrição da prop
    */
   const ComponentName = ({ prop1, prop2, ...rest }) => {
     // Lógica do componente

     return (
       <Box {...rest}>
         {/* JSX do componente */}
       </Box>
     );
   };

   export default ComponentName;
   ```

3. **Padrões a seguir:**
   - ✅ SEMPRE usar Wrapper Pattern do MUI
   - ✅ Documentar props com JSDoc
   - ✅ Componente funcional
   - ✅ PropTypes ou TypeScript (se aplicável)
   - ✅ Spread rest props (`...rest`) para flexibilidade
   - ✅ Código limpo e comentado
   - ✅ Responsividade com MUI breakpoints se necessário

4. **Se for campo de formulário:**
   - Integrar com React Hook Form (usar Controller se necessário)
   - Seguir padrão de `framework/components/fields/Text.jsx`
   - Props: name, control, label, error, helperText, etc.

5. **Sugerir onde usar o componente:**
   - Em quais módulos pode ser útil
   - Exemplos de uso

6. **Perguntar se deseja:**
   - Criar hook customizado para o componente
   - Adicionar storybook (se tiver)
   - Criar testes unitários
