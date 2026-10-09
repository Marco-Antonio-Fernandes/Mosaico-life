# Mosaico Life — Style Guide: Next.js, React e TypeScript

Proposta v1 para uma equipe de dois desenvolvedores que também usa IA para
gerar código.

Stack obrigatória:

- Next.js com App Router;
- React;
- TypeScript;
- Tailwind CSS;
- shadcn/ui com Radix UI;
- Lucide Icons;
- React Hook Form;
- Zod;
- tema baseado em CSS variables.

Este guia deve ser aplicado ao código novo e aos trechos alterados. Não é
necessário migrar todo o código existente de uma vez. Refatorações maiores
devem ser mudanças próprias.

As versões instaladas, o lockfile e as configurações do projeto determinam
quais APIs podem ser usadas. Não misture exemplos de Tailwind v3 e v4, versões
diferentes de Zod ou APIs de Next.js de versões diferentes.

## 1. Arquitetura por funcionalidade

Organize o domínio em features. Use app para rotas e composição, components
para UI compartilhada e lib para infraestrutura transversal.

~~~text
src/
├── app/
│   ├── (authenticated)/
│   │   └── patients/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── layout.tsx
│   └── globals.css
├── features/
│   └── patients/
│       ├── components/
│       │   ├── patient-form.tsx
│       │   └── patient-list.tsx
│       ├── schemas/
│       │   └── patient-form.schema.ts
│       ├── server/
│       │   └── get-patients.ts
│       ├── patient.types.ts
│       └── patient-form.test.tsx
├── components/
│   ├── ui/
│   └── shared/
├── hooks/
└── lib/
    ├── api/
    ├── env/
    └── utils.ts
~~~

Responsabilidades:

- app define rotas, layouts, metadata e composição;
- features contém componentes, validação e operações específicas;
- components/ui contém primitivas visuais sem API ou regra de negócio;
- components/shared contém padrões reutilizados entre features;
- hooks contém hooks reutilizados;
- lib/api centraliza transporte HTTP e normalização de erros;
- lib/env separa configuração pública e privada;
- server contém operações que só podem executar no servidor.

Crie somente pastas e arquivos necessários. Server actions, hooks e adaptadores
de navegador ficam dentro da feature quando forem específicos dela.

Regras de dependência:

- components/ui não importa features;
- components/shared não importa features;
- features não importa arquivos de app;
- lib não importa componentes de tela;
- app pode compor features, mas não deve duplicar sua regra;
- não crie dependências circulares;
- evite index.ts que reexporte a feature inteira e misture servidor e navegador.

## 2. Nomenclatura e imports

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivos e pastas | kebab-case | user-form.tsx |
| Componentes | PascalCase | UserForm |
| Tipos e interfaces | PascalCase | UserFormProps |
| Funções e variáveis | camelCase | getUsers |
| Hooks | prefixo use | useUserFilters |
| Booleanos | intenção explícita | isLoading, canEdit |
| Constantes de domínio | UPPER_SNAKE_CASE | MAX_UPLOAD_SIZE_BYTES |
| Schemas | camelCase + Schema | userFormSchema |

Use código em inglês e mensagens da interface em português. Preserve nomes
definidos por APIs externas.

Use named exports. Use default exports somente quando o framework exigir, como
page.tsx e layout.tsx. Use import type para tipos.

Use o alias @/ quando estiver configurado. Imports relativos curtos dentro da
própria feature também são válidos.

## 3. TypeScript e contratos

TypeScript strict é obrigatório. Não use any no código da aplicação. Use
unknown para valores sem contrato e valide antes de acessá-los.

- prefira inferência para variáveis locais e retornos simples;
- declare contratos em props, integrações e interfaces públicas;
- não use cast para fingir que uma resposta da API é válida;
- valide respostas externas em runtime com Zod;
- modele estados incompatíveis com discriminated unions;
- use type como padrão;
- use interface quando extensão ou interoperabilidade exigir;
- prefira unions de strings para estados simples;
- use as const quando precisar dos valores em runtime;
- campos opcionais devem representar ausência real;
- não esconda erro de modelagem tornando tudo opcional.

Exemplo de contrato validado:

~~~ts
import { z } from "zod";

export const patientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  status: z.enum(["active", "archived"]),
});

export type Patient = z.infer<typeof patientSchema>;
~~~

## 4. Fronteira servidor e navegador

Componentes do servidor são o padrão. Use componentes do cliente somente
quando houver:

- interação;
- estado local;
- eventos do navegador;
- APIs como IndexedDB, File System Access ou Web Crypto;
- APIs que dependam de window, document ou navigator.

Regras:

- coloque use client somente no menor componente necessário;
- não envie dados sensíveis desnecessários para o cliente;
- nunca exponha variáveis privadas com prefixo público;
- não use segredo em Server Component serializado para o navegador;
- mantenha acesso à API e transformação de dados fora da apresentação;
- componentes visuais não devem conhecer banco ou regra de autorização.

O offline é uma exceção explícita: adaptadores de navegador ficam na feature
offline do Marco, com dados locais criptografados e sem uso de localStorage
para prontuários ou anotações.

## 5. API e tratamento de dados

O frontend usa lib/api para transporte HTTP. Endpoints específicos ficam na
feature responsável.

Todo contrato deve definir:

- método e rota;
- autenticação;
- parâmetros;
- corpo;
- resposta de sucesso;
- erros possíveis;
- permissão necessária;
- comportamento offline, quando aplicável.

IDs devem usar UUID. Datas devem ser UTC no backend e ISO 8601 no transporte.
O frontend deve converter datas apenas para exibição.

Não confie em validação feita somente no frontend. O backend deve validar
autorização, formato e regra de negócio novamente.

Normalize erros em uma estrutura única para que telas consigam tratar:

- erro de validação;
- não autenticado;
- sem permissão;
- não encontrado;
- conflito;
- indisponibilidade;
- erro inesperado.

Não mostre stack trace, SQL, token, conteúdo clínico ou dados internos na
mensagem ao usuário.

## 6. Formulários

Use React Hook Form e Zod.

- o schema é a fonte da validação do formulário;
- o backend repete a validação;
- labels são obrigatórios;
- campos devem informar ajuda e erro;
- erros devem aparecer próximos ao campo;
- preserve valores quando uma submissão falhar;
- desabilite o envio enquanto a operação estiver processando;
- confirme sucesso com mensagem curta e não sensível;
- ações destrutivas exigem confirmação;
- não limpe um formulário antes de confirmar que o servidor salvou.

Schemas específicos ficam em features/<feature>/schemas. Schemas de transporte
compartilhados ficam em lib/api ou em um contrato explicitamente compartilhado.

## 7. UI/UX

Use shadcn/ui como base dos componentes e Radix UI para comportamento
interativo. Os componentes ficam no repositório e podem ser adaptados ao
produto. Use Lucide para ícones.

### Organização

- components/ui: Button, Input, Dialog, Select, Table e primitives;
- components/shared: PageHeader, EmptyState, ErrorState, LoadingState,
  OfflineIndicator e ConflictAlert;
- features/<feature>/components: componentes específicos da feature;
- app: composição da tela e layout.

Pedro mantém o tema e os componentes compartilhados. Marco deve consumi-los e
propor alterações por PR. Não crie cópia de Button, Modal, Table, formulário ou
indicador de estado dentro de uma feature.

### Visual do Mosaico Life

- estilo calmo, profissional e limpo;
- base neutra;
- contraste alto;
- azul-petróleo como cor primária;
- vermelho somente para destruição, erro ou risco;
- mesma cor para o mesmo significado em todas as telas;
- densidade adequada para prontuário, agenda e financeiro;
- textos curtos e claros em português;
- ícones acompanhados de texto quando a ação não for óbvia;
- nenhum dado clínico em toast, URL, log de frontend ou título de erro.

### Estados obrigatórios

Toda tela que carrega dados deve tratar:

- carregando;
- vazio;
- sucesso;
- erro;
- sem permissão;
- sessão expirada;
- offline;
- sincronizando;
- conflito, quando aplicável.

## 8. Acessibilidade e responsividade

Meta mínima: WCAG 2.2 AA.

- use HTML semântico;
- forneça label acessível para controles;
- mantenha foco visível;
- permita navegação por teclado;
- não use cor como única indicação;
- mantenha contraste suficiente;
- associe erro ao campo correspondente;
- respeite zoom e tamanho de fonte;
- não dependa somente de hover;
- use aria somente quando o HTML semântico não for suficiente.

As telas devem funcionar em desktop, tablet e largura estreita. A instalação e
o layout desktop Linux são prioridade inicial, mas nenhuma tela deve quebrar em
tela menor.

## 9. Loading, erro e navegação

Use loading.tsx, Suspense ou estados locais de forma coerente com o fluxo.

- telas de lista usam skeleton quando o carregamento demora;
- telas vazias explicam a próxima ação;
- erros oferecem tentar novamente quando possível;
- navegação preserva filtros quando isso ajuda o usuário;
- ações assíncronas mostram progresso;
- não use alert nativo para fluxos importantes;
- confirmação de saída deve ocorrer somente quando houver alteração não salva.

## 10. Segurança e privacidade

O Mosaico trata dados sensíveis.

- não use localStorage para prontuários ou anotações;
- não coloque dado clínico em cache público;
- não registre conteúdo clínico em logs;
- minimize dados enviados ao navegador;
- valide permissão no backend;
- use exclusão lógica quando o histórico precisar ser preservado;
- documentos, áudios e transcrições devem ter acesso controlado;
- WhatsApp não recebe diagnóstico, prontuário, áudio ou transcrição;
- tokens e segredos ficam em variáveis protegidas;
- erros públicos não revelam detalhes internos.

## 11. Offline

O frontend offline pertence à feature offline do Marco. Cada feature informa:

- entidades que podem funcionar offline;
- operações permitidas;
- campos somente leitura;
- campos obrigatórios;
- evento após alteração;
- regra de conflito;
- dados que nunca saem do servidor.

Uma alteração offline deve ter operation_id, entity, entity_id, action,
base_version, occurred_at e payload.

Nunca sobrescreva silenciosamente anotação clínica, documento emitido ou valor
financeiro confirmado. Conflitos devem ser visíveis e decididos conforme o
contrato da feature.

## 12. Testes

Cada feature deve ter testes proporcionais ao risco:

- schema e validação;
- componente principal;
- fluxo de formulário;
- estados de erro;
- permissão;
- integração com API;
- conflito, quando sincronizável;
- fluxo crítico ponta a ponta.

Prioridades do Mosaico:

- login e expiração;
- cadastro de paciente;
- criação de agendamento;
- abertura e finalização de sessão;
- emissão de documento;
- registro de recebimento;
- operação offline e sincronização;
- conflito de anotação ou financeiro.

## 13. Git e revisão

Use branches pequenas e commits que expressem uma mudança.

Antes de abrir PR:

- rode lint;
- rode typecheck;
- rode testes relacionados;
- confira o diff;
- confira que não há segredo;
- confira que a alteração não duplicou componente ou contrato;
- atualize a task ou documentação quando o fluxo mudou.

O PR deve explicar:

- o que mudou;
- qual feature é responsável;
- contratos de API alterados;
- migrações;
- testes executados;
- impacto no offline;
- riscos ou decisões pendentes.

## 14. Checklist final

- a funcionalidade está na feature correta;
- a rota está em app e só compõe a feature;
- o código segue as convenções de nomes;
- TypeScript não usa any;
- resposta externa foi validada;
- loading, vazio, erro e sucesso foram tratados;
- teclado e foco funcionam;
- dados sensíveis não aparecem em logs ou URLs;
- componentes compartilhados foram reutilizados;
- backend valida novamente autorização e dados;
- o contrato de sincronização foi atualizado quando necessário;
- testes e typecheck passaram.
