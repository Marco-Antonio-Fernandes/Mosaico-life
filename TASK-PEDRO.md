# Mosaico — Task do Pedro

## Responsabilidade

O Pedro implementará frontend e backend dos módulos:

- pacientes e prontuários;
- demandas, objetivos e evolução;
- sessões e anotações clínicas;
- documentos e atestados;
- financeiro.

A infraestrutura de hospedagem, servidor, domínio, HTTPS, Docker de produção,
backups e monitoramento fica fora destas tasks e será tratada separadamente.

## Limites com o Marco

O Marco é responsável por conta, segurança, agenda, comunicação, notificações,
offline e sincronização.

O Pedro consumirá esses módulos por API ou eventos documentados. Ele não deverá
duplicar autenticação, agenda, comunicação, notificações ou o motor de
sincronização.

## Contrato comum obrigatório

Antes de desenvolver as telas, Pedro e Marco devem combinar:

- IDs em UUID;
- datas em UTC e formato ISO 8601;
- autenticação única para toda a API;
- formato único para respostas e erros;
- registros sincronizáveis com versão, data de atualização e exclusão lógica;
- nenhum frontend acessando o banco diretamente;
- alterações de API documentadas antes de serem utilizadas;
- nenhum token, senha ou dado sensível versionado;
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

### Regra para as telas do Pedro

As telas de pacientes, prontuários, sessões, documentos e financeiro devem usar
os componentes compartilhados e manter:

- o mesmo cabeçalho e menu;
- a mesma largura e hierarquia de conteúdo;
- os mesmos estados de feedback;
- o mesmo padrão de tabela, filtro, formulário e modal;
- o mesmo comportamento em desktop, tablet e tela estreita.

## Rotas pertencentes ao Pedro

- /api/v1/patients
- /api/v1/clinical
- /api/v1/sessions
- /api/v1/documents
- /api/v1/finance

O frontend e o backend devem manter a mesma separação por módulo. O frontend
de um módulo só chama as rotas do contrato daquele módulo.

# PEDRO-01 — Pacientes e prontuários

## Frontend

Implementar lista, busca, filtros, cadastro, edição, arquivamento, contatos,
etiquetas, tela completa do prontuário e histórico de sessões, documentos,
financeiro e comunicações relevantes.

## Backend

Implementar entidade de paciente, contatos, status, etiquetas, busca, filtros,
arquivamento lógico, autorização, histórico de alterações e endpoints para uso
online e sincronização.

## Fluxo de cadastro

1. O usuário abre novo paciente.
2. O frontend valida o formato dos campos.
3. A API valida obrigatoriedade, tamanho e permissão.
4. O backend cria o paciente com UUID e versão inicial.
5. O frontend abre o prontuário criado.
6. Os outros módulos usam somente esse patient_id.

## Regras

- o Marco usa o patient_id deste módulo na agenda;
- nenhum módulo cria uma segunda tabela de pacientes;
- arquivar não apaga o histórico;
- dados clínicos não ficam em campos de contato;
- a busca nunca retorna paciente de outro usuário ou organização.

# PEDRO-02 — Demandas, objetivos e evolução

## Frontend

Implementar criação de demanda ou objetivo, título, descrição, prioridade,
indicadores, estado, histórico por período, linha do tempo, gráficos,
encerramento e reabertura.

Estados iniciais:

- identified;
- under_evaluation;
- in_follow_up;
- improving;
- stable;
- resolved;
- paused;
- reopened.

## Backend

Implementar demandas, objetivos, indicadores, registros de evolução, histórico
de estados, vínculo com paciente e sessão, encerramento, justificativa e
endpoints de histórico e gráficos.

## Fluxo

1. O usuário abre o prontuário.
2. Cria ou seleciona uma demanda.
3. Registra estado, indicador e observação.
4. A API salva uma nova entrada de evolução.
5. O estado atual é atualizado sem apagar o histórico.
6. A linha do tempo e os gráficos passam a considerar a nova entrada.

## Regras

- o sistema não diagnostica;
- o sistema não decide que uma demanda foi resolvida;
- somente o profissional encerra ou reabre;
- registros antigos não são sobrescritos sem histórico;
- gráficos apenas representam dados informados pelo profissional.

# PEDRO-03 — Sessões e tela de atendimento

## Frontend

Implementar abertura pelo agendamento, abertura manual, paciente, horário,
duração, presença, falta, cancelamento, anotações, demandas trabalhadas,
evolução, lembretes, rascunho e finalização.

Em etapa posterior, poderá incluir gravação de áudio com autorização explícita,
transcrição, revisão, conversão em anotação e prazo de retenção.

## Backend

Implementar sessão realizada, vínculo com agendamento do Marco, anotações,
duração, presença, demandas trabalhadas, alterações de evolução, lembretes,
controle de acesso e histórico.

## Fluxo

1. O usuário abre um agendamento da agenda do Marco.
2. O frontend recebe appointment_id e patient_id.
3. O módulo carrega os dados básicos e demandas autorizadas.
4. O usuário registra a sessão e as anotações.
5. A API salva rascunhos quando necessário.
6. O usuário finaliza a sessão.
7. A API marca a sessão como concluída e registra o horário.
8. O sistema pode emitir evento para notificações ou financeiro.

## Regras

- a anotação clínica pertence à sessão e ao profissional;
- a agenda não armazena anotação clínica;
- WhatsApp não recebe conteúdo desta tela automaticamente;
- rascunho e sessão finalizada possuem estados diferentes;
- exclusão de anotação gera auditoria;
- áudio e transcrição ficam fora da primeira versão até haver consentimento,
  armazenamento e retenção definidos.

# PEDRO-04 — Documentos e atestados

## Frontend

Implementar abertura pelo prontuário, seleção de paciente e modelo,
preenchimento administrativo, edição, revisão obrigatória, rascunho, emissão,
visualização do PDF, histórico de versões e cancelamento controlado.

## Backend

Implementar modelos, campos, geração de PDF, armazenamento protegido, vínculo
com paciente, identificador, versões, profissional responsável, data e estados:

- draft;
- issued;
- cancelled;
- replaced.

## Fluxo de emissão

1. O usuário escolhe paciente e modelo.
2. A API preenche apenas campos administrativos permitidos.
3. O usuário revisa e completa o conteúdo.
4. O documento pode ser salvo como rascunho.
5. A emissão exige confirmação explícita.
6. O backend gera o PDF e salva a versão emitida.
7. O PDF fica vinculado ao prontuário.
8. Alterações posteriores criam nova versão.

## Regras

- diagnósticos e justificativas nunca são preenchidos automaticamente;
- uma versão emitida não é editada silenciosamente;
- compartilhamento é uma ação explícita;
- documentos não são enviados automaticamente pelo WhatsApp;
- o arquivo respeita a autorização do usuário autenticado.

# PEDRO-05 — Financeiro

## Frontend

Implementar visão de fluxo de caixa, recebimentos, pagamentos pendentes,
atrasados, despesas, categorias, recorrências, vínculo com paciente e sessão,
valores previstos e realizados, filtros e identificação manual de pagamento não
reconhecido.

## Backend

Implementar recebimentos, pagamentos de sessões, despesas, categorias,
recorrências, comprovantes quando aplicável, vínculo opcional com paciente e
sessão, consultas de fluxo de caixa, auditoria e preparação para Pix.

Estados mínimos:

- pending;
- received;
- overdue;
- refunded;
- unlinked.

## Fluxo de recebimento

1. Uma sessão pode gerar valor previsto.
2. O usuário registra ou importa um recebimento.
3. A API tenta relacionar paciente e sessão.
4. Sem certeza, o recebimento fica unlinked.
5. O frontend pede a escolha do paciente.
6. O usuário confirma ou mantém sem vínculo.
7. O sistema registra responsável, data e alteração.
8. O Marco pode receber evento para exibir uma notificação.

## Fluxo de despesa

1. O usuário informa descrição, valor, data e categoria.
2. Pode marcar a despesa como recorrente.
3. A API valida valor e data.
4. A despesa entra no fluxo de caixa.
5. Recorrências futuras são geradas sem alterar lançamentos anteriores.

## Regras

- o financeiro não armazena senha bancária;
- Pix será desacoplado;
- valores confirmados não são apagados por conflito offline;
- estorno deve ser auditável;
- o financeiro usa patient_id, appointment_id e session_id, mas não altera
  registros dos módulos de origem;
- informação financeira não é enviada ao paciente sem ação explícita.

# Contrato para sincronização offline

O motor offline é do Marco, mas o Pedro deve entregar, para cada entidade:

- nome da entidade;
- campos permitidos offline;
- campos somente leitura;
- operações permitidas;
- campos obrigatórios;
- regra de exclusão;
- regra de conflito;
- dados que nunca saem do servidor;
- evento emitido após alteração.

Contrato inicial:

| Entidade | Criar offline | Editar offline | Regra de conflito |
|---|---:|---:|---|
| Paciente | Sim | Sim | revisão por campo ou decisão explícita |
| Demanda | Sim | Sim | não sobrescrever histórico |
| Evolução | Sim | Não apagar | criar conflito |
| Sessão | Sim | Sim antes de finalizar | decisão explícita |
| Documento | Rascunho | Rascunho | criar versão |
| Financeiro | Sim, pendente | Antes de confirmar | nunca apagar valor confirmado |

O Pedro fornece as regras de negócio. O Marco transporta as operações no motor
genérico sem duplicar regras clínicas ou financeiras.

# Dependências do Pedro

- Login e permissões vêm do módulo de conta do Marco.
- Sessões podem ser abertas pelo appointment_id da agenda do Marco.
- Financeiro usa pacientes, agendamentos e sessões, mas não os modifica.
- Documentos usam identidade e permissões fornecidas pelo Marco.
- Offline depende dos campos e conflitos informados nesta task.

# Critérios de conclusão

Uma task só estará concluída quando frontend e backend estiverem funcionando,
sem dados simulados, com permissão, tratamento de erro, teste do caso principal,
teste de falha, documentação de API, campos offline definidos e nenhuma regra
duplicada do Marco.

# Entrega para o Marco

O Pedro deve entregar rotas, requisições, respostas, erros, eventos, campos
obrigatórios, exemplos, migrações, campos permitidos offline, estratégia de
conflito, testes e instruções de integração.
