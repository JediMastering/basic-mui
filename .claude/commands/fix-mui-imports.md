---
description: Corrigir importações do MUI para usar o Wrapper Pattern
---

Analise o projeto e corrija todas as importações incorretas do Material-UI que estejam importando diretamente de `@mui/material` ao invés do wrapper centralizado.

**O que fazer:**

1. **Buscar importações incorretas:**
   - Use `grep -r "from '@mui/material'" src/` para encontrar todos os arquivos
   - Use `grep -r "from \"@mui/material\"" src/` (com aspas duplas também)
   - Exclua `src/theme/mui/index.js` da busca (é o próprio wrapper)

2. **Para cada arquivo encontrado:**
   - Ler o arquivo
   - Identificar os componentes sendo importados
   - Substituir a importação incorreta:

     ❌ DE: `import { Button, Box } from '@mui/material';`
     ✅ PARA: `import { Button, Box } from '@/theme/mui';`

     (ou o path correto do wrapper no projeto)

3. **Verificar outros imports relacionados:**
   - `@mui/icons-material` pode continuar sendo importado direto
   - `@mui/x-date-pickers` pode continuar sendo importado direto
   - `@mui/x-tree-view` pode continuar sendo importado direto
   - Apenas `@mui/material` deve usar o wrapper

4. **Mostrar resumo:**
   - Quantos arquivos foram corrigidos
   - Lista de arquivos modificados
   - Sugerir executar os testes para garantir que nada quebrou

**Importante:**
- ✅ Não modificar o arquivo do próprio wrapper
- ✅ Manter formatação e estilo do código original
- ✅ Preservar comentários existentes
- ✅ Verificar se o alias `@/theme/mui` funciona ou usar path relativo correto
