---
description: Adicionar validações Yup a um formulário existente
---

Adicione ou melhore validações Yup em um schema existente, seguindo padrões brasileiros quando aplicável.

**O que fazer:**

1. **Perguntar ao usuário:**
   - Qual arquivo de validação modificar (ex: `src/modules/category/validation/categoryValidation.js`)
   - Ou criar novo schema (nome do módulo/entidade)

2. **Tipos comuns de validação:**

   **Texto simples:**
   ```js
   campo: yup.string()
     .required('Campo obrigatório')
     .min(3, 'Mínimo 3 caracteres')
     .max(100, 'Máximo 100 caracteres')
   ```

   **Email:**
   ```js
   email: yup.string()
     .required('Email obrigatório')
     .email('Email inválido')
   ```

   **CPF:**
   ```js
   cpf: yup.string()
     .required('CPF obrigatório')
     .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
     .test('cpf-valido', 'CPF inválido', validarCPF)
   ```

   **CNPJ:**
   ```js
   cnpj: yup.string()
     .required('CNPJ obrigatório')
     .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido')
     .test('cnpj-valido', 'CNPJ inválido', validarCNPJ)
   ```

   **Telefone:**
   ```js
   telefone: yup.string()
     .required('Telefone obrigatório')
     .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido')
   ```

   **CEP:**
   ```js
   cep: yup.string()
     .required('CEP obrigatório')
     .matches(/^\d{5}-\d{3}$/, 'CEP inválido')
   ```

   **Senha:**
   ```js
   senha: yup.string()
     .required('Senha obrigatória')
     .min(8, 'Mínimo 8 caracteres')
     .matches(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
     .matches(/[a-z]/, 'Deve conter ao menos uma letra minúscula')
     .matches(/[0-9]/, 'Deve conter ao menos um número')
   ```

   **Confirmação de senha:**
   ```js
   confirmarSenha: yup.string()
     .required('Confirmação obrigatória')
     .oneOf([yup.ref('senha'), null], 'As senhas não conferem')
   ```

   **Número:**
   ```js
   valor: yup.number()
     .required('Valor obrigatório')
     .positive('Valor deve ser positivo')
     .min(0, 'Valor mínimo: 0')
     .max(999999, 'Valor máximo: 999.999')
   ```

   **Data:**
   ```js
   data: yup.date()
     .required('Data obrigatória')
     .max(new Date(), 'Data não pode ser futura')
   ```

   **Select/Dropdown:**
   ```js
   categoria: yup.string()
     .required('Selecione uma categoria')
     .notOneOf([''], 'Selecione uma categoria válida')
   ```

   **Array:**
   ```js
   itens: yup.array()
     .min(1, 'Adicione ao menos um item')
     .required('Campo obrigatório')
   ```

3. **Estrutura do arquivo:**
   ```js
   import * as yup from 'yup';

   export const [nome]ValidationSchema = yup.object().shape({
     campo1: yup.string().required('Campo obrigatório'),
     campo2: yup.number().positive('Deve ser positivo'),
     // ... mais campos
   });
   ```

4. **Se necessário criar função de validação customizada:**
   - Criar em `src/framework/utils/validators.js` ou similar
   - Exportar e usar no schema

5. **Testar mensagens:**
   - Todas em português
   - Claras e diretas
   - Sem jargão técnico
