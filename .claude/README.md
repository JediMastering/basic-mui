# Claude Code - Configuração do Projeto

Este diretório contém configurações e comandos personalizados para o Claude Code neste projeto.

## 📄 Arquivos

### `project_context.md`
Contexto completo do projeto que é automaticamente carregado em todas as conversas com o Claude Code.

Inclui:
- Visão geral do projeto (SaaS ERP Financeiro)
- Stack tecnológica completa
- Estrutura de arquivos e pastas
- **Wrapper Pattern do MUI** (regra fundamental!)
- Boas práticas e convenções
- Testes E2E e cobertura
- Integração com back-end

## 🎯 Slash Commands

Comandos personalizados disponíveis através de `/comando`:

| Comando | Descrição |
|---------|-----------|
| `/help` | Lista todos os comandos disponíveis |
| `/test-coverage` | Executa testes E2E com cobertura |
| `/test-headed` | Executa testes com visualização no navegador |
| `/analyze-coverage` | Analisa cobertura e sugere melhorias |
| `/new-module` | Cria novo módulo seguindo padrões |
| `/new-crud` | Cria CRUD completo funcional |
| `/create-component` | Cria componente reutilizável no framework |
| `/add-validation` | Adiciona validações Yup |
| `/fix-mui-imports` | Corrige importações do MUI (Wrapper Pattern) |
| `/check-project` | Verifica saúde do projeto |

## 🚀 Como Usar

### No Claude Code:

1. **Comandos simples:**
   ```
   /test-coverage
   /help
   /check-project
   ```

2. **Comandos com parâmetros:**
   ```
   /new-module produto
   /new-crud cliente
   /create-component DatePicker
   ```

3. **Contexto automático:**
   O Claude Code carrega automaticamente o contexto do projeto a cada nova conversa, então você não precisa repetir informações sobre:
   - Estrutura do projeto
   - Padrão MUI Wrapper
   - Convenções de código
   - Stack tecnológica

## 📚 Benefícios

### Antes (sem comandos):
```
Você: "Preciso criar um CRUD de produtos"
Claude: "Como você quer estruturar?"
Você: *explica estrutura, padrões, wrapper pattern, validações...*
Claude: "Entendi, vou criar..."
```

### Agora (com comandos):
```
Você: "/new-crud produto"
Claude: *cria tudo seguindo os padrões automaticamente*
```

## 🔧 Customização

Para adicionar novos comandos:

1. Crie um arquivo em `.claude/commands/novo-comando.md`
2. Use o formato:
   ```markdown
   ---
   description: Descrição curta do comando
   ---

   Instruções detalhadas de o que o comando deve fazer...
   ```

3. Use o comando com `/novo-comando`

## 📖 Documentação Relacionada

- **Testes E2E**: `doc/testes-e2e-cobertura.md`
- **Padrões do Projeto**: `docs/GEMINI_CONTEXT_REACT.md`
- **Contexto Completo**: `.claude/project_context.md`

## 💡 Dicas

1. **Use `/help`** sempre que esquecer os comandos disponíveis
2. **Use `/check-project`** antes de commits importantes
3. **Use `/test-coverage`** para garantir qualidade do código
4. **Use `/fix-mui-imports`** se importar componentes MUI errados
5. **Consulte o context** em `.claude/project_context.md` quando tiver dúvidas sobre padrões

---

*Esta configuração garante que o Claude Code sempre entenda o contexto do projeto e siga os padrões estabelecidos!*
