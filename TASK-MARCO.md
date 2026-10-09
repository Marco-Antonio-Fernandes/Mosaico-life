# Mosaico Life — Task do Marco


## Andamento registrado — 09/10/2026

O protótipo frontend completo foi solicitado pelo usuário com dados mockados.
Esta decisão substitui, somente nesta prévia, a restrição anterior a dados fictícios.
Os requisitos integrais abaixo continuam valendo para a implementação real.

### Entregas já realizadas

- [x] ~~Shell, navegação, tema dark, layout responsivo e estados compartilhados iniciais.~~
- [x] ~~Vitral de cérebro lateral em peças coloridas no menu inteiro; sem logo ou faixa no topo.~~
- [x] ~~Início com resumo, atalhos e agenda do dia (mock).~~
- [x] ~~Agenda visual diária/semanal/mensal, seleção de data e criação local de horário.~~
- [x] ~~Post-its grandes no canto superior direito; exemplo aberto, criar/recolher/dispensar.~~
- [x] ~~Comunicação administrativa, notificações, configurações e offline Linux (mock).~~
- [x] ~~Configuração do backend compartilhado e componente de health check; home atual usa apenas mocks.~~

### Pendências desta responsabilidade

- [ ] Login, segurança, sessões, permissões e recuperação de acesso.
- [ ] Agenda real: conflitos, disponibilidade, recorrência e confirmação.
- [ ] API/provedor de comunicação, consentimentos e notificações reais.
- [ ] Persistência de notas, instalação Linux, criptografia, pasta e sincronização real.

**Tasks principais: parciais.** Uma tela mock concluída não conclui seu backend.
Não foram executados novos testes/builds nesta etapa, conforme solicitado.

Veja [status consolidado de frontend, backend e servidor](<../Servidor Rotatix/STATUS-MOSAICO.md>)
e [plano das telas](docs/PLANO-FRONTEND-MOCK.md).


## Responsabilidade

O Marco implementará frontend e backend dos módulos:

- conta e segurança;
- agenda;
- comunicação com pacientes;
- notificações;
- funcionamento offline e sincronização.

A infraestrutura de hospedagem, servidor, domínio, HTTPS, Docker de produção,
backups e monitoramento fica fora destas tasks e será tratada separadamente.

O Marco não implementará todo o backend do Mosaico. Ele implementará apenas o
backend necessário para os módulos sob sua responsabilidade.

## Limites com o Pedro

O Pedro é responsável por pacientes, prontuários, demandas, evolução, sessões,
anotações clínicas, documentos e financeiro.

O Marco poderá consumir essas informações por API ou eventos documentados, mas
não deverá alterar diretamente tabelas, regras ou arquivos pertencentes aos
módulos do Pedro.

## Ordem de início

Antes de implementar as telas de conta, agenda, comunicação, notificações e
offline, o Marco deve montar o layout base da aplicação. Os módulos dele e os
módulos do Pedro usarão o mesmo shell, navegação, hierarquia de conteúdo e
estados de feedback.

# MARCO-00 — Layout base e composição da aplicação

Implementar a primeira versão do layout da área autenticada do Mosaico Life em
Next.js, deixando a aplicação pronta para receber as features dos dois
desenvolvedores.

## Frontend

- criar o layout autenticado em `src/app`, com menu lateral, cabeçalho, área de
  conteúdo e container responsivo;
- definir a navegação inicial para pacientes, prontuários, agenda, sessões,
  comunicação, notificações, documentos, financeiro e configurações;
- criar páginas de entrada ou placeholders para rotas ainda não implementadas,
  sem dados clínicos ou financeiros fictícios;
- aplicar o tema por CSS variables e reutilizar `components/ui` e
  `components/shared`;
- padronizar PageHeader, largura de conteúdo, breadcrumbs quando necessários,
  loading, vazio, erro, sem permissão, offline, sincronizando e conflito;
- garantir navegação por teclado, foco visível, contraste WCAG 2.2 AA e
  comportamento em desktop, tablet e tela estreita;
- manter a composição do layout separada das regras de negócio e do acesso à
  API.

## Limites

- o Marco é responsável pela composição do layout base e pela integração visual
  dos estados dos seus módulos;
- Pedro continua responsável pelo tema e pelos componentes compartilhados. Se
  faltar uma primitiva ou houver necessidade de alteração global, o Marco deve
  solicitar a mudança no componente compartilhado, sem criar cópia dentro de
  uma feature;
- placeholders devem usar estado vazio ou mensagem de construção, nunca
  pacientes, sessões, documentos, valores ou notificações inventados;
- autenticação real, permissões e bloqueio de sessão entram no MARCO-01; o
  MARCO-00 não pode criar uma autenticação paralela.

## Critérios de aceite

- a aplicação abre no shell principal e as áreas previstas possuem navegação;
- uma tela de cada grupo demonstra a mesma hierarquia e largura de conteúdo;
- os estados de loading, vazio, erro, sem permissão e offline são reutilizáveis;
- o layout não expõe dados sensíveis em URL, toast, log ou mensagem de erro;
- Pedro consegue iniciar as telas de pacientes e clínica usando o mesmo shell,
  sem duplicar menu, cabeçalho ou componentes de estado.

# MARCO-00.1 — Visão geral e continuidade visual

Status: em andamento.

Esta entrega adianta a primeira tela de continuidade dos dois produtos sem
antecipar a implementação completa dos módulos de negócio. A navegação deve
mostrar o estado da operação, os próximos eventos e as notificações mais
importantes assim que o usuário abrir o sistema.

## Direção visual comum

- o nome e a futura logo do produto ficam independentes do elemento gráfico;
- o mosaico aparece na lateral, junto da separação dos módulos, como um vitral
  antigo e irregular, com peças assimétricas e cores próprias de cada produto;
- Life usa turquesa, azul, lilás e rosa em uma base escura e calma;
- Food usa laranja, âmbar, ciano, verde e violeta em uma base escura de operação;
- notificações relevantes podem aparecer como post-its no canto direito da tela,
  sem expor dados clínicos ou informações sensíveis;
- dados demonstrativos devem ser identificados no código e substituídos por API
  antes da liberação de produção.

## Mosaico Life — primeira visão

- criar a home com resumo do dia, continuidade da sincronização e estado da API
  compartilhada;
- criar post-its visuais para agenda, comunicação e lembretes operacionais;
- criar a primeira agenda visual com visões dia, semana e mês;
- mostrar horários, confirmação, pendência, janela livre e atendimento online;
- manter a agenda visual nesta etapa, sem criar ainda a regra final de conflito,
  recorrência ou confirmação real.

## Mosaico Food — primeira visão

- criar o painel de visão geral com pedidos realizados, pessoas atendidas,
  faturamento e ticket médio;
- mostrar comparação com o período anterior e permitir a troca visual entre
  dia, semana e mês;
- permitir selecionar uma data de referência para a leitura do painel;
- destacar avisos de WhatsApp, atendimento, pedidos e estoque;
- manter a tela preparada para substituir os valores demonstrativos pelas
  consultas do backend compartilhado.

## Critérios de aceite do MARCO-00.1

- os dois sistemas abrem em uma home visualmente distinta, mas com o mesmo
  princípio de continuidade;
- o mosaico lateral não é tratado como a logo definitiva;
- Life possui agenda visual e post-its de notificações;
- Food possui indicadores operacionais, filtros de período e avisos visíveis;
- o status da home informa se API e banco estão respondendo;
- nenhum valor demonstrativo é apresentado como dado real;
- o layout permanece responsivo e acessível em tela estreita.

## Contrato comum obrigatório

Antes de desenvolver as telas, Marco e Pedro devem combinar:

- IDs em UUID;
- datas em UTC e formato ISO 8601;
- autenticação única para toda a API;
- formato único para respostas e erros;
- registros sincronizáveis com versão, data de atualização e exclusão lógica;
- nenhum frontend acessando o banco diretamente;
- alterações de API documentadas antes de serem utilizadas;
- nenhum token, senha, QR code ou sessão de provedor versionado;
- nenhum dado clínico enviado automaticamente por WhatsApp.

## Padrão obrigatório de UI/UX

Os dois desenvolvedores usarão o mesmo padrão visual e os mesmos componentes:

- Next.js com TypeScript usando App Router;
- Tailwind CSS para estilos e tokens;
- shadcn/ui como base dos componentes;
- Radix UI para componentes interativos acessíveis;
- Lucide para ícones;
- React Hook Form e Zod para formulários e validação;
- CSS variables para cores, espaçamento, bordas e estados.

O estilo do Mosaico será calmo, profissional e limpo, com base neutra,
contraste alto, azul-petróleo como cor principal e vermelho somente para ações
destrutivas. Não usar cores diferentes para o mesmo significado em telas
distintas.

### Organização dos componentes

- components/ui: componentes base compartilhados;
- components/shared: cabeçalho, menu, estados de carregamento, vazio, erro,
  offline e conflito;
- modules/<modulo>/components: componentes específicos do módulo;
- pages: composição da tela, sem regras visuais repetidas.

Pedro é o responsável pelo tema e pelos componentes compartilhados. O Marco
monta o layout base e usa esses componentes nos seus módulos. Se precisar de um
componente novo ou de alteração global, deverá propor a mudança no mesmo PR ou
solicitar alteração no componente compartilhado; não deve criar uma versão
paralela.

### Regras de UX

- toda tela deve possuir estados de carregamento, vazio, erro e sucesso;
- operações offline mostram claramente pendente, sincronizando, sincronizado ou
  conflito;
- formulários sempre exibem label, ajuda, erro e confirmação;
- botões devem indicar quando estão processando;
- ações destrutivas exigem confirmação;
- foco de teclado, contraste, labels e navegação devem seguir WCAG 2.2 AA;
- usar HTML semântico e componentes acessíveis;
- nunca exibir anotação clínica em toast, URL, log do frontend ou mensagem de
  erro;
- dados sensíveis devem ser reduzidos em previews e notificações;
- não adicionar outra biblioteca visual, como MUI, Chakra ou Bootstrap, sem
  decisão conjunta.

### Regra para as telas do Marco

As telas de conta, agenda, comunicação, notificações e offline devem usar os
componentes compartilhados e manter:

- o mesmo cabeçalho e menu;
- a mesma largura e hierarquia de conteúdo;
- os mesmos estados de feedback;
- o mesmo padrão de tabela, filtro, formulário e modal;
- o mesmo comportamento em desktop, tablet e tela estreita.

## Rotas pertencentes ao Marco

- /api/v1/auth
- /api/v1/agenda
- /api/v1/communications
- /api/v1/notifications
- /api/v1/sync

O frontend e o backend devem manter a mesma separação por módulo. O frontend
de um módulo só chama as rotas do contrato daquele módulo.

# MARCO-01 — Conta e segurança

## Frontend

Implementar login, logout, recuperação de acesso, perfil, preferências, aviso
de sessão expirada, bloqueio visual por inatividade e mensagens de erro.

## Backend

Implementar usuários, sessões, login, logout, recuperação de acesso, alteração
de senha, expiração de sessão, permissões e auditoria de acessos.

## Fluxo

1. O usuário informa as credenciais.
2. A API valida as credenciais e as permissões.
3. A API cria a sessão.
4. O frontend carrega o perfil e as permissões.
5. Após o tempo de inatividade, a interface é bloqueada.
6. A sessão é validada novamente antes de liberar dados protegidos.
7. O logout invalida a sessão no servidor e limpa os dados de sessão locais.

## Regras

- nenhuma senha pode ser armazenada em texto;
- o usuário não pode escolher um identificador de outro usuário;
- o frontend não decide permissões;
- autenticação não deve ser duplicada nos módulos do Pedro.

# MARCO-02 — Agenda

## Frontend

Implementar visão diária, semanal e mensal; criação, edição, cancelamento e
reagendamento; recorrência; bloqueio de horário; falta; sessão presencial ou
online; abertura da tela de atendimento; e status de confirmação.

## Backend

Implementar sessões agendadas, horário, duração, recorrência, disponibilidade,
bloqueios, cancelamentos, reagendamentos e os status:

- scheduled;
- confirmed;
- cancelled;
- rescheduled;
- no_show;
- completed.

Também deve validar conflitos de horário e emitir eventos para comunicação e
notificações.

## Fluxo de criação

1. O frontend consulta os horários disponíveis.
2. O usuário escolhe o paciente usando o patient_id do módulo do Pedro.
3. O frontend envia paciente, data, horário, duração e tipo.
4. O backend valida permissão e conflito de horários.
5. A sessão é criada como scheduled.
6. O evento da agenda é disponibilizado para notificações.
7. Se habilitado, o módulo de comunicação inicia a confirmação.

## Limites

- o Marco não cria uma segunda tabela de pacientes;
- a agenda guarda apenas referência ao patient_id;
- a agenda não armazena anotação clínica;
- dados do paciente são obtidos por API ou evento aprovado.

# MARCO-03 — Comunicação com pacientes

## Frontend

Implementar configuração de comunicação, consentimento, opt-out, confirmação,
cancelamento, reagendamento, chat resumido, respostas pendentes de análise e
histórico das mensagens relevantes.

## Backend

Implementar adaptador independente do provedor, fila, worker, webhook seguro,
retentativas, idempotência, registro de consentimento, opt-out, envio, resposta
e falha.

Status mínimos:

- pending;
- sent;
- delivered;
- failed;
- confirmed;
- cancelled;
- reschedule_requested;
- needs_review.

## Fluxo de confirmação

1. A agenda identifica uma sessão que precisa de confirmação.
2. O módulo verifica consentimento e telefone válido.
3. A API cria a mensagem pendente.
4. O worker envia pelo adaptador do provedor.
5. O envio é registrado com operation_id único.
6. A resposta entra por webhook validado.
7. A resposta é classificada como confirmação, cancelamento, reagendamento ou
   análise manual.
8. O status da agenda é atualizado.
9. O frontend mostra o resultado e a resposta original quando necessário.

## Conteúdo permitido

Podem ser enviados somente data, horário, confirmação, cancelamento,
reagendamento e instruções administrativas autorizadas.

Nunca enviar automaticamente prontuário, anotação clínica, diagnóstico, áudio,
transcrição, evolução ou documento clínico.

# MARCO-04 — Notificações

## Frontend

Implementar notificações de sessões próximas, confirmações, cancelamentos,
reagendamentos, lembretes, pagamentos recebidos ou não identificados e erros de
sincronização.

## Backend

Implementar criação, agendamento, preferências, fila, marcação como lida,
histórico e reprocessamento de falhas.

## Regras

- toda notificação deve ter identificador para evitar duplicação;
- falha de notificação não pode apagar o evento de origem;
- eventos financeiros vindos do Pedro devem seguir o contrato combinado;
- notificações não alteram prontuários nem anotações clínicas.

# MARCO-05 — Offline e sincronização

O Marco é responsável pelo frontend e backend do funcionamento offline. A API
continua sendo a fonte oficial dos dados; a cópia local existe para permitir
trabalho sem conexão.

## Frontend

Implementar a instalação e o funcionamento offline para desktop Linux,
indicador online/offline, cadastro de pasta, permissão de leitura e escrita,
armazenamento criptografado, fila de operações, sincronização automática e
manual, progresso, erros, conflitos, reconexão e troca de pasta.

O suporte oficial inicial será Linux. A aplicação não pode depender de um
servidor local rodando na máquina do usuário para abrir ou consultar a cópia
offline. Se a API de armazenamento escolhida não estiver disponível no
navegador/empacotamento Linux suportado, a interface deve oferecer uma
alternativa segura e explicar a limitação sem apagar os dados do servidor.

## Dados básicos sincronizáveis no primeiro ciclo

A sincronização começa por uma lista de entidades permitidas e versionadas. O
servidor continua sendo a fonte de verdade; a cópia local é criptografada e
serve para continuidade de trabalho.

| Grupo | Dados permitidos inicialmente | Fora do primeiro ciclo |
|---|---|---|
| Conta | preferências locais, última sincronização e permissões necessárias para a interface | senha, token e sessão do provedor |
| Paciente | `patient_id`, nome de exibição, contato autorizado e status | prontuário, diagnóstico, evolução e anotação clínica |
| Agenda | `appointment_id`, `patient_id`, data, duração, tipo e status | conteúdo de sessão e anotação clínica |
| Comunicação | consentimento, opt-out, status de envio e `operation_id` | dados clínicos, áudio e transcrição |
| Documentos | referência, status e versão autorizada | arquivo clínico completo sem política de retenção |

Cada entidade deve carregar `entity_id`, `version`, `updated_at`,
`deleted_at` quando aplicável e `operation_id` nas alterações locais. O Pedro
define os campos e conflitos dos módulos dele; o Marco transporta a operação
sem duplicar regra clínica.

Crediário e o saldo do que cada cliente deve não pertencem ao Mosaico Life.
Esse dado deve ser sincronizado no Mosaico Food, no módulo de clientes e
financeiro do Pedro, com lançamentos idempotentes e sem sobrescrever saldo
confirmado silenciosamente.

## Backend

Implementar bootstrap dos dados permitidos, recebimento de operações locais,
envio de alterações do servidor, cursor, operation_id idempotente, base_version,
autorização por operação, retorno de aceitas, rejeitadas e conflitantes e
auditoria da sincronização. As operações aceitas devem ser aplicadas em
transação no banco central e disponibilizadas para os demais dispositivos pelo
cursor; a sincronização não pode criar uma segunda fonte de verdade.

Rotas previstas:

- GET /api/v1/sync/bootstrap
- POST /api/v1/sync/push
- GET /api/v1/sync/pull?cursor=...
- POST /api/v1/sync/resolve-conflict

## Operação local

Cada alteração local deve conter operation_id, entity, entity_id, action,
base_version, occurred_at e payload. O payload poderá ficar criptografado na
cópia local.

O motor de sincronização deve aceitar as entidades dos dois desenvolvedores,
mas não deve duplicar regras de pacientes, clínica, documentos ou financeiro.
Cada dono de módulo fornece campos sincronizáveis e regras de conflito.

## Fluxo de configuração

1. O usuário abre a configuração offline.
2. O sistema explica quais dados ficarão localmente.
3. O usuário escolhe uma pasta.
4. O navegador solicita permissão explícita.
5. O sistema cria uma estrutura própria na pasta.
6. É criada uma chave aleatória da instalação.
7. A chave é protegida por uma chave derivada de senha local.
8. Nenhuma senha ou chave em texto aberto é enviada ao backend.
9. Os dados autorizados são baixados e gravados criptografados.

Se a senha local for perdida, a cópia local não poderá ser descriptografada. Os
dados já sincronizados no servidor continuam preservados. A interface deverá
oferecer reconexão ou descarte explícito da cópia local sem apagar o servidor.

## Fluxo sem internet

1. O usuário abre o Mosaico sem conexão.
2. A aplicação desbloqueia a cópia local.
3. O usuário altera um dado permitido.
4. O frontend valida e grava a operação pendente.
5. A operação recebe operation_id.
6. O usuário continua trabalhando.
7. A interface mostra a quantidade pendente.

## Fluxo de sincronização

1. A aplicação detecta a conexão.
2. Envia as operações pendentes para sync/push.
3. O servidor valida autorização, versão e idempotência.
4. Operações válidas são aplicadas pelo módulo dono do dado.
5. Operações repetidas retornam o mesmo resultado sem duplicação.
6. Conflitos ficam separados para decisão do usuário.
7. A aplicação chama sync/pull usando o cursor atual.
8. As alterações do servidor são aplicadas localmente.
9. O cursor só é atualizado após gravação local bem-sucedida.
10. A interface mostra a última sincronização.

## Regras de conflito

- anotações clínicas nunca são sobrescritas silenciosamente;
- documentos emitidos sempre criam versão;
- lançamentos financeiros não são apagados por conflito;
- agenda conflitante exige decisão explícita;
- exclusões são lógicas até confirmação do servidor;
- o usuário visualiza versão local e versão do servidor.

O Marco implementa o motor genérico. O Pedro informa quais campos dos seus
módulos podem ser sincronizados e como cada conflito deve ser tratado.

## Fora do offline inicial

Não funcionam imediatamente sem internet: envio de WhatsApp, webhooks,
pagamentos externos, recuperação de senha, alteração de permissões e qualquer
ação que dependa de provedor em tempo real. Essas operações aguardam a conexão e
uma nova validação no servidor.

# Dependências do Marco

- Agenda usa patient_id do módulo de pacientes do Pedro.
- Comunicação usa eventos da agenda.
- Notificações usam eventos de agenda, sessão e financeiro.
- Offline usa contratos de sincronização dos dois módulos.
- O motor offline não cria regras próprias para dados do Pedro.

# Critérios de conclusão

Uma task só estará concluída quando frontend e backend estiverem funcionando,
sem dados simulados, com validação de permissão, tratamento de erro, teste do
caso principal, teste de falha, documentação da API e nenhuma regra duplicada.

# Entrega para o Pedro

O Marco deve entregar rotas, requisições, respostas, erros, eventos, campos
obrigatórios, exemplos, migrações, testes e instruções de integração.
