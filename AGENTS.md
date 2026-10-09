# Mosaico Life — instruções para agentes de código

Estas instruções devem ser aplicadas após a adoção do guia pelo time. O projeto
assume Next.js com App Router. Confira a implementação real antes de alterar
qualquer arquivo.

## Antes de alterar

- Leia docs/STYLE_GUIDE.md.
- Leia package.json, lockfile e configurações relevantes.
- Leia um fluxo semelhante no repositório.
- Leia a task correspondente em TASK-MARCO.md ou TASK-PEDRO.md.
- Leia os contratos da API usados pela tarefa.
- Use somente APIs compatíveis com as versões instaladas.
- Se o guia divergir de uma implementação existente, indique o conflito e faça
  a menor mudança coerente com a tarefa.

## Regras obrigatórias

- Organize funcionalidades em src/features.
- Organize rotas e composição em src/app.
- Use kebab-case em arquivos e pastas.
- Use PascalCase em componentes e tipos.
- Use camelCase em funções e variáveis.
- Escreva código em inglês e textos da interface em português.
- Mantenha TypeScript strict.
- Não use any no código da aplicação.
- Não coloque regras de negócio em componentes visuais.
- Não acesse banco de dados diretamente pelo frontend.
- Não coloque segredo, token ou dado clínico em código público.
- Não crie uma segunda implementação de componente compartilhado.

## Limites entre Marco e Pedro

O Pedro é dono das features de pacientes, clínica, sessões, documentos e
financeiro.

O Marco é dono das features de conta, agenda, comunicação, notificações,
offline e sincronização.

Cada desenvolvedor implementa frontend e backend do próprio módulo. Um módulo
pode consumir outro somente por contrato de API ou evento documentado. Não
altere diretamente tabelas, regras ou componentes de uma feature do outro
desenvolvedor.

Pedro mantém o tema e os componentes compartilhados. Marco utiliza esses
componentes e propõe alterações por PR, sem criar versões paralelas.

## Padrão visual

Use Next.js, TypeScript, Tailwind CSS, shadcn/ui com Radix UI, Lucide Icons,
React Hook Form e Zod. O tema usa CSS variables.

Não adicione MUI, Chakra, Bootstrap ou outra biblioteca visual sem decisão
conjunta registrada no PR.

## Validação antes de concluir

- Execute lint e typecheck.
- Execute os testes relacionados.
- Teste loading, vazio, erro, sucesso e permissão negada.
- Teste responsividade e teclado nas telas alteradas.
- Confira que o fluxo não expõe dados sensíveis em logs, URLs, toasts ou erros.
- Atualize a documentação da API quando o contrato mudar.
- Informe no PR arquivos alterados, dependências, testes e riscos.
