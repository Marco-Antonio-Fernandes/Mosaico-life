# Mosaico — Task do Marco

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

- React com TypeScript;
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

O Pedro será o responsável pelo tema e pelos componentes compartilhados. O
Marco usará esses componentes nos seus módulos. Se precisar de um componente
novo ou de alteração global, deverá propor a mudança no mesmo PR ou solicitar
alteração no componente compartilhado; não deve criar uma versão paralela.

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

Implementar PWA, indicador online/offline, cadastro de pasta, permissão de
leitura e escrita, armazenamento criptografado, fila de operações, sincronização
automática e manual, progresso, erros, conflitos, reconexão e troca de pasta.

O suporte oficial inicial será Chrome e Edge no Mac. O Safari deve exibir uma
alternativa segura caso não ofereça a API necessária.

## Backend

Implementar bootstrap dos dados permitidos, recebimento de operações locais,
envio de alterações do servidor, cursor, operation_id idempotente, base_version,
autorização por operação, retorno de aceitas, rejeitadas e conflitantes e
auditoria da sincronização.

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
