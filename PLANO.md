# Mosaico

## Sistema de gestão para psicólogos

## 1. Visão do produto

O **Mosaico** será um sistema web para apoiar a rotina de psicólogos, permitindo organizar pacientes, sessões, anotações e informações clínicas de forma segura.

O sistema deverá funcionar normalmente pela internet e também oferecer uma experiência offline para situações em que não houver conexão.

## 2. Identidade

- **Nome:** Mosaico
- **Descrição:** Sistema de gestão para psicólogos.
- **Ideia do nome:** Cada paciente possui uma história formada por diferentes partes — sessões, observações, evolução e informações — que são organizadas em um único lugar.

## 3. Plataforma inicial

O sistema será desenvolvido como uma aplicação web usando **React**.

Também será configurado como **PWA**, permitindo que o usuário:

- acesse o sistema pelo navegador;
- instale o Mosaico no Mac como um aplicativo;
- use um ícone próprio na área de trabalho ou no Dock;
- continue usando o sistema offline, conforme as funções disponíveis;
- não dependa da App Store ou de uma conta de desenvolvedor Apple.

Instalar uma PWA no Mac não significa automaticamente que todos os dados funcionarão offline. A parte offline será implementada especificamente no sistema.

## 4. Arquitetura planejada

```text
Aplicação React/PWA
        ↓
Armazenamento local offline criptografado
        ↓
API segura de sincronização
        ↓
Banco de dados central
```

### Frontend

- React;
- interface responsiva;
- instalação como PWA;
- controle de estado offline e online;
- indicação clara do status da sincronização.

### API e servidor

- autenticação de usuários;
- gerenciamento de pacientes e sessões;
- recebimento e envio das alterações locais;
- validação das permissões;
- registro de alterações e acessos;
- banco de dados central como fonte principal das informações.

### Banco central

O banco central deverá armazenar os dados oficiais do sistema, com backups e mecanismos de recuperação.

## 5. Funcionamento offline

No primeiro acesso, o sistema poderá solicitar ao usuário:

> Escolha a pasta onde os dados offline do Mosaico serão armazenados.

O usuário escolherá a pasta e autorizará explicitamente o acesso de leitura e gravação.

O Mosaico deverá:

1. solicitar a pasta por meio do seletor do navegador;
2. salvar a autorização para usos posteriores, quando permitido pelo navegador;
3. criar uma estrutura própria dentro da pasta escolhida;
4. armazenar os dados em formato criptografado;
5. permitir trabalhar sem conexão;
6. registrar alterações pendentes de sincronização;
7. sincronizar com a API quando a internet voltar;
8. solicitar novamente a pasta caso a permissão seja removida ou perdida.

O acesso à pasta será limitado à pasta selecionada pelo usuário. A aplicação não deverá procurar ou acessar outras pastas sem nova autorização.

## 6. Sincronização

A API será a fonte principal dos dados. A pasta local será uma cópia offline protegida para permitir continuidade do trabalho.

Quando a conexão retornar:

- novas anotações serão enviadas para a API;
- alterações recebidas do servidor serão baixadas;
- itens já sincronizados serão marcados corretamente;
- conflitos deverão ser identificados e tratados antes de sobrescrever informações.

O sistema não deverá depender da sincronização de pastas por iCloud, Dropbox ou Google Drive. A sincronização oficial deverá acontecer pela API do Mosaico.

## 7. Segurança e privacidade

Como o sistema poderá tratar informações relacionadas à saúde, a segurança deverá fazer parte da arquitetura desde o início.

Medidas planejadas:

- dados offline criptografados;
- comunicação com a API usando HTTPS;
- autenticação segura;
- possibilidade futura de autenticação em dois fatores;
- permissões por usuário e função;
- encerramento automático da sessão;
- bloqueio automático após período de inatividade;
- registro de acessos e alterações;
- backups protegidos;
- não armazenar anotações sensíveis em texto aberto;
- não usar `localStorage` para guardar prontuários ou notas clínicas;
- não colocar dados sensíveis no cache comum do service worker;
- opção para trocar ou reconectar a pasta offline.

A seleção de uma pasta não substitui a criptografia. Qualquer pessoa com acesso ao computador ou à pasta poderá tentar copiar os arquivos; por isso, o conteúdo local deverá permanecer protegido.

## 8. Navegadores recomendados

O acesso a uma pasta escolhida pelo usuário usa recursos de acesso ao sistema de arquivos disponíveis apenas em navegadores compatíveis.

Para a primeira versão, o Mosaico deverá indicar **Google Chrome ou Microsoft Edge no Mac** como ambientes oficialmente suportados.

O suporte do Safari deverá ser testado separadamente. Caso alguma função não esteja disponível, o sistema deverá oferecer uma alternativa segura, como armazenamento local controlado ou exportação/importação protegida.

## 9. Primeira versão sugerida

### Cadastro e organização

- cadastro de pacientes;
- dados básicos de contato;
- status do paciente;
- histórico de sessões;
- criação de anotações;
- pesquisa e filtros;
- organização por etiquetas ou categorias.

### Sessões

- agenda;
- registro de comparecimento;
- anotações da sessão;
- data e duração;
- acompanhamento da evolução.

### Conta e segurança

- login;
- logout;
- recuperação de acesso;
- bloqueio por inatividade;
- seleção da pasta offline;
- indicação de conexão e sincronização.

## 10. Evolução futura

Depois da primeira versão, poderão ser adicionados:

- múltiplos profissionais e clínicas;
- permissões administrativas;
- relatórios;
- exportação de dados;
- anexos protegidos;
- notificações;
- cobrança e planos;
- aplicativo desktop com Tauri, caso a PWA não seja suficiente;
- banco local mais avançado para grandes volumes de dados offline.

## 11. Decisões atuais

- O nome do produto será **Mosaico**.
- A descrição será **Sistema de gestão para psicólogos**.
- A primeira plataforma será React com PWA.
- O sistema usará uma API para sincronização.
- O usuário poderá escolher a pasta de armazenamento offline.
- Os dados locais serão criptografados.
- A App Store e uma conta Apple não serão necessárias para a primeira versão.
- A API continuará sendo a fonte principal dos dados.

## 12. Pontos a definir no desenvolvimento

- tecnologia do backend;
- provedor do banco de dados;
- método de criptografia local;
- estratégia de recuperação da senha ou chave local;
- regras de conflito na sincronização;
- quais funções poderão funcionar offline;
- política de backup e retenção;
- níveis de acesso para psicólogos, administradores e demais usuários.

## 13. Comunicação automática com pacientes

O Mosaico deverá ter um módulo de comunicação automática integrado à agenda.

### Confirmação de sessões

O sistema poderá enviar uma mensagem automática ao paciente para confirmar o horário da sessão. A resposta deverá ser interpretada e transformada em um status da agenda:

- confirmou o horário;
- recusou ou cancelou;
- solicitou reagendamento;
- respondeu com uma mensagem não reconhecida;
- não respondeu.

Quando necessário, o sistema deverá avisar o psicólogo e apresentar a resposta original do paciente.

### Histórico de conversas

O Mosaico deverá ter uma tela de chat relacionada ao paciente e à sessão, contendo apenas:

- mensagens automáticas enviadas pelo sistema;
- respostas recebidas do paciente;
- status da confirmação;
- solicitações de reagendamento;
- registros importantes da comunicação.

Não será necessário importar todo o histórico de conversas do WhatsApp. O objetivo será manter somente a comunicação relevante para a agenda e o atendimento.

### Integração de mensagens

O Mosaico será um sistema independente e não terá integração ou dependência do Fix.io. Ele poderá oferecer funções semelhantes, mas terá seus próprios módulos e integrações.

O sistema deverá ter uma camada de comunicação independente do restante da aplicação. Assim, será possível:

- manter o Mosaico funcionando mesmo que um provedor de mensagens mude;
- conectar futuramente outros provedores;
- avaliar o uso de uma integração oficial do WhatsApp para reduzir riscos de bloqueio ou instabilidade;
- desenvolver as funções de confirmação, reagendamento e chat resumido dentro do próprio Mosaico.

### Arquitetura do WhatsApp, backend e Docker

É possível colocar o backend do Mosaico e a integração com WhatsApp na mesma implantação e iniciar tudo com Docker. O comando de operação poderá ser:

```bash
docker compose up -d --build
```

Isso não precisa significar um único processo ou um único contêiner. A recomendação é usar serviços separados, conectados por uma rede interna:

```text
Navegador/PWA
       ↓ HTTPS
Frontend React ───────┐
                      ↓
                 API do Mosaico
                  ├── Banco central
                  ├── Fila e worker de tarefas
                  └── Adaptador WhatsApp ── WAK ou provedor escolhido
```

Serviços previstos no `docker-compose.yml`:

- `web`: frontend React/PWA servido por HTTPS;
- `api`: backend do Mosaico, autenticação, pacientes, agenda e regras de negócio;
- `worker`: envio de mensagens, processamento de respostas, tentativas e notificações;
- `whatsapp`: adaptador para o WAK ou para a API oficial do WhatsApp, quando o provedor exigir um serviço separado;
- `db`: banco central, com volume persistente e rotina de backup;
- `redis` ou serviço equivalente, caso seja necessário controlar filas e tarefas assíncronas;
- proxy reverso, quando necessário, para HTTPS, domínio e recebimento seguro de webhooks.

O frontend não deverá conversar diretamente com o WhatsApp. O backend será responsável por autorizar o envio, registrar o evento, controlar consentimento e encaminhar a mensagem ao adaptador. As respostas recebidas deverão entrar por webhook seguro, ser validadas e ficar vinculadas ao paciente e à sessão somente quando forem relevantes para a agenda.

Para produção, a primeira opção deverá ser a API oficial do WhatsApp Business. Caso o WAK seja utilizado como gateway baseado em sessão do WhatsApp Web, ele deverá ficar isolado, com sua sessão armazenada em volume protegido e com a possibilidade de substituição. Essa modalidade poderá sofrer mudanças, limitações ou bloqueios do provedor e não deverá ser tratada como equivalente à API oficial.

Regras obrigatórias para essa integração:

- não enviar automaticamente anotações clínicas, diagnósticos, áudios, transcrições ou prontuários pelo WhatsApp;
- usar mensagens limitadas à agenda, confirmação, cancelamento e reagendamento, com consentimento do paciente;
- registrar opt-in, opt-out, mensagens enviadas, respostas, falhas e usuário responsável;
- manter tokens, chaves, sessão do gateway e senhas somente em variáveis de ambiente ou segredo protegido;
- não versionar arquivos `.env`, tokens, QR codes ou sessões do WhatsApp;
- aplicar limites, idempotência, retentativas e monitoramento para evitar mensagens duplicadas;
- manter o gateway acessível apenas pela API e pelos webhooks necessários;
- permitir desligar ou trocar o provedor sem interromper o restante do Mosaico.

Assim, Mosaico, backend e integração de mensagens poderão funcionar juntos em uma instalação Docker, sem criar uma dependência estrutural entre o prontuário e o provedor de WhatsApp.

## 14. Cadastro e acompanhamento dos pacientes

Cada paciente deverá possuir uma área completa com:

- dados cadastrais;
- contatos;
- histórico de sessões;
- anotações clínicas;
- demandas, problemas ou objetivos terapêuticos;
- objetivos definidos;
- lembretes;
- arquivos e materiais relacionados;
- situação financeira;
- histórico de confirmações e comunicações.

### Acompanhamento de evolução

O psicólogo poderá registrar indicadores de evolução definidos por ele, como metas, escalas ou avaliações periódicas.

O sistema deverá apresentar:

- evolução por paciente;
- histórico por período;
- gráfico de melhora, estabilidade ou piora;
- comparação entre indicadores;
- observações associadas a cada registro.

Os gráficos deverão representar os dados informados pelo profissional. O sistema não deverá diagnosticar o paciente nem interpretar os dados clínicos automaticamente.

## 21. Acompanhamento de demandas e objetivos terapêuticos

Ao criar o prontuário, o psicólogo poderá cadastrar uma ou mais demandas do paciente. Cada demanda representará um problema, objetivo ou área de acompanhamento que poderá evoluir de forma independente.

Exemplos de demandas:

- ansiedade;
- dificuldades de relacionamento;
- luto;
- autoestima;
- organização da rotina;
- objetivo terapêutico definido com o paciente.

O profissional deverá poder usar a nomenclatura mais adequada ao seu método de trabalho. O sistema não deverá impor que toda demanda seja chamada de “problema” ou “doença”.

### Informações de cada demanda

Cada demanda poderá conter:

- título ou nome;
- descrição inicial;
- data de identificação;
- prioridade;
- objetivos relacionados;
- indicadores de acompanhamento;
- observações profissionais;
- sessões vinculadas;
- histórico de alterações;
- data de encerramento, quando aplicável.

### Estados de acompanhamento

O psicólogo poderá atualizar o estado de cada demanda conforme o acompanhamento evoluir:

- identificada;
- em avaliação;
- em acompanhamento;
- em evolução;
- controlada ou estável;
- resolvida ou encerrada;
- pausada;
- reaberta.

Os nomes dos estados poderão ser configuráveis para respeitar a abordagem e a forma de trabalho de cada profissional. O sistema não deverá marcar uma demanda como resolvida, controlada ou encerrada por conta própria.

### Relação com as sessões

Em cada sessão, o psicólogo poderá:

- vincular a anotação a uma ou mais demandas;
- registrar o que foi trabalhado;
- adicionar observações novas;
- atualizar o estado da demanda;
- registrar avanços, dificuldades ou mudanças;
- criar um novo objetivo;
- cadastrar uma nova demanda identificada durante o acompanhamento.

Assim, cada demanda terá uma linha do tempo própria, sem perder a visão geral do prontuário.

### Encerramento e reabertura

Quando o profissional considerar que uma demanda foi resolvida, controlada ou encerrada, poderá registrar:

- estado final;
- data;
- justificativa ou observação;
- resumo da evolução;
- orientação de acompanhamento, se necessário.

Uma demanda encerrada deverá permanecer no histórico e poderá ser reaberta caso volte a ser relevante. O sistema não deverá apagar automaticamente o histórico clínico.

## 22. Documentos profissionais e atestados

O Mosaico deverá permitir criar documentos relacionados ao paciente e ao atendimento, incluindo atestados e outros modelos utilizados pelo profissional.

### Recursos do módulo

- modelos personalizáveis;
- modelo padrão de atestado pronto para preenchimento;
- preenchimento automático de dados básicos do paciente e do profissional;
- edição e revisão antes da emissão;
- geração em PDF;
- impressão ou compartilhamento controlado;
- salvamento de uma cópia no prontuário;
- histórico de versões;
- número ou identificador do documento;
- estados de rascunho, emitido, cancelado e substituído;
- registro da data, hora e profissional responsável;
- busca por tipo, paciente e período.

### Preenchimento automático

O fluxo deverá funcionar assim:

1. A psicóloga abre o prontuário do paciente ou escolhe um paciente na tela de documentos.
2. Seleciona o modelo de atestado ou outro documento.
3. O Mosaico preenche automaticamente os campos cadastrados, como nome do paciente, dados de identificação permitidos, data, profissional responsável e informações administrativas.
4. A psicóloga revisa, complementa ou corrige o conteúdo.
5. O documento é salvo como rascunho ou emitido em PDF.
6. Uma cópia da versão emitida fica vinculada ao prontuário do paciente.

Os campos automáticos deverão ser configuráveis. Informações clínicas, diagnósticos, justificativas e conclusões não deverão ser preenchidos sem revisão e confirmação explícita da profissional.

O sistema deverá permitir que o profissional revise o texto antes da emissão e não deverá inserir automaticamente diagnósticos, informações clínicas ou conclusões que não tenham sido selecionadas e confirmadas por ele.

Os modelos e fluxos de emissão deverão ser configuráveis de acordo com as regras profissionais aplicáveis. Uma futura integração poderá oferecer assinatura eletrônica ou digital, caso seja necessária.

## 15. Tela de sessão

O Mosaico deverá ter um modo específico para o momento do atendimento.

Ao iniciar o horário agendado, o sistema poderá identificar o paciente pela agenda e abrir a tela da sessão. O psicólogo também deverá poder alterar manualmente o paciente ou iniciar uma sessão fora do horário previsto.

A tela de sessão poderá conter:

- paciente atual;
- horário de início e duração;
- informações essenciais do paciente;
- objetivos e lembretes da sessão;
- anotações rápidas;
- gravação de áudio, quando autorizada;
- transcrição do áudio;
- criação de lembretes;
- encerramento e salvamento da sessão.

### Lembretes durante a sessão

Enquanto estiver escrevendo ou transcrevendo, o psicólogo poderá criar lembretes vinculados à sessão, ao paciente ou a uma data futura.

Exemplos:

- enviar material ao paciente;
- abordar determinado assunto na próxima sessão;
- revisar uma evolução;
- fazer contato em uma data específica.

Na data ou no horário configurado, o Mosaico deverá enviar uma notificação.

### Áudio e transcrição

O psicólogo poderá gravar áudio como material de apoio para elaborar as anotações da sessão. O sistema deverá permitir:

- iniciar e pausar a gravação;
- finalizar e salvar o áudio;
- transcrever o conteúdo;
- revisar e editar a transcrição;
- transformar trechos em anotações ou lembretes;
- excluir o áudio ou definir prazo de retenção.

Áudios e transcrições deverão ser tratados como dados sensíveis. A gravação deverá exigir autorização adequada e ter controles claros de acesso, armazenamento e exclusão.

## 16. Agenda

O Mosaico deverá oferecer uma agenda completa para o psicólogo:

- visualização diária, semanal e mensal;
- sessões presenciais e online;
- criação, alteração e cancelamento de horários;
- horários recorrentes;
- bloqueios de disponibilidade;
- confirmação automática;
- reagendamento;
- faltas e cancelamentos;
- lembretes para o profissional e para o paciente;
- abertura rápida da tela de sessão.

A agenda será a base para comunicação, notificações, controle financeiro e identificação do atendimento atual.

## 17. Gestão financeira

O Mosaico deverá possuir um módulo financeiro integrado aos pacientes e à agenda.

### Recebimentos

O sistema deverá registrar:

- valor da sessão;
- paciente relacionado;
- data e hora do recebimento;
- forma de pagamento;
- sessão correspondente;
- situação: pendente, recebido, estornado ou atrasado.

Quando um Pix for identificado, o sistema deverá tentar relacioná-lo ao paciente. Se houver dúvida, deverá perguntar ao usuário:

> Qual paciente realizou este pagamento?

O usuário poderá confirmar, corrigir ou deixar o recebimento sem vínculo até resolver a situação.

### Integração financeira

A primeira versão deverá manter a integração financeira desacoplada. As possibilidades são:

- receber eventos de um provedor de Pix;
- integrar diretamente com um banco;
- evoluir futuramente para Open Finance, se fizer sentido.

A decisão deverá considerar segurança, estabilidade, custo, disponibilidade de webhooks e suporte a conciliação automática. O sistema não deverá armazenar senhas bancárias.

### Despesas e controle da empresa

O psicólogo poderá cadastrar despesas, incluindo:

- descrição;
- categoria;
- valor;
- data;
- recorrência;
- comprovante;
- observação.

O sistema deverá apresentar:

- receitas;
- despesas;
- saldo;
- valores a receber;
- fluxo de caixa;
- custos recorrentes;
- faturamento por período;
- receitas por paciente;
- projeções de ganhos;
- comparação entre previsto e realizado.

As projeções deverão ser apresentadas como estimativas baseadas nos dados cadastrados, sem substituir uma contabilidade profissional.

## 18. Notificações

O sistema deverá centralizar notificações sobre:

- confirmação de sessão;
- cancelamento;
- pedido de reagendamento;
- sessão próxima;
- lembretes criados durante uma sessão;
- pagamento recebido;
- pagamento não identificado;
- despesas recorrentes;
- falhas ou pendências de sincronização;
- tarefas importantes.

As notificações deverão informar a origem, a data e permitir marcar como lidas ou abrir diretamente o item relacionado.

## 19. Entidades principais do sistema

```text
Usuário
 ├── Pacientes
 │    ├── Demandas e objetivos terapêuticos
 │    ├── Sessões
 │    │    ├── Anotações
 │    │    ├── Áudios e transcrições
 │    │    └── Lembretes
 │    ├── Documentos e atestados
 │    ├── Comunicações
 │    └── Recebimentos
 ├── Agenda
 ├── Despesas
 └── Notificações
```

## 20. Ordem sugerida de desenvolvimento

### Fase 1 — Base segura

- contas e autenticação;
- pacientes;
- agenda;
- sessões e anotações;
- API e banco central;
- PWA instalável;
- armazenamento offline criptografado;
- sincronização básica;
- estrutura inicial de Docker Compose para desenvolvimento e homologação.

### Fase 2 — Comunicação

- mensagens automáticas;
- confirmação de horários;
- cancelamento e reagendamento;
- chat limitado às mensagens relevantes;
- notificações;
- adaptador do WhatsApp, webhooks, fila de envio e logs de integração;
- execução conjunta do frontend, backend e serviços de apoio pelo Docker Compose.

### Fase 3 — Atendimento

- tela de sessão;
- lembretes durante a sessão;
- gravação de áudio;
- transcrição;
- indicadores e gráficos de evolução.

### Fase 4 — Financeiro

- recebimentos por paciente;
- identificação de Pix;
- despesas;
- fluxo de caixa;
- projeções;
- conciliação financeira.

### Fase 5 — Integrações e expansão

- integração financeira mais avançada;
- possíveis recursos de Open Finance;
- múltiplos profissionais;
- clínicas e permissões administrativas;
- relatórios avançados;
- implantação em produção com HTTPS, backups, monitoramento e troca controlada do provedor de WhatsApp.
