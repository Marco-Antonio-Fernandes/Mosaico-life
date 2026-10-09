# Plano de frontend — Mosaico Life
Atualizado em 09/10/2026. Prévia completa solicitada pelo usuário, só frontend e mocks.

## Direção de composição

Aplicação para psicologia: vitral de cérebro de perfil como fundo do menu inteiro, sem logo.
Tema escuro turquesa/lilás, peças coloridas assimétricas e contraste nos atalhos.
Menu mobile recolhível, cards reorganizados por largura e tabelas com rolagem interna.
Notas fora dos cards, grandes e flutuantes no canto superior direito em todas as telas.

## Post-its

- [x] ~~Nota de exemplo aberta ao iniciar.~~
- [x] ~~Criar nota/lembrete, mostrar mensagem completa e dispensar.~~
- [x] ~~Mural pode ser recolhido para liberar a tela.~~
- [x] ~~Seis cores: amarelo, rosa, lilás, azul, verde e pêssego.~~
- [x] ~~Novas notas alternam cor; reabrir o mural varia as cores; botão permite trocar individualmente.~~
- [x] ~~Cor inicial varia ao abrir a aplicação sem piscar continuamente.~~
- [ ] Persistência/sincronização por usuário. Hoje ficam apenas na memória da sessão.

## Fluxo clínico ajustado

- [x] ~~A tela principal de Atendimento começa em Pacientes; cada paciente abre seu prontuário.~~
- [x] ~~Demandas e evolução ficam dentro das abas do prontuário, sem depender de uma tela clínica separada.~~
- [x] ~~A sessão mostra objetivos e estratégia antes do atendimento.~~
- [x] ~~Durante a sessão existem apenas anotações de apoio, sem criar nota clínica automaticamente.~~
- [x] ~~A etapa de transcrição mostra as anotações de apoio e permite criar a nota clínica no prontuário.~~
- [x] ~~A transcrição também permite criar uma demanda/tarefa vinculada ao paciente.~~
- [ ] Persistir nota clínica, demanda, evolução e vínculo de sessão no backend com auditoria.

## Mapa de telas já desenhado

| Rota | Composição | Interação local | Responsável |
|---|---|---|---|
| / | Resumo, agenda do dia, continuidade e atalhos | Navegação contextual | Marco: composição |
| /pacientes | Lista e entrada única do cuidado | Abrir `/pacientes/:id` | PEDRO-01 |
| /pacientes/:id | Prontuário com resumo, anotações, demandas, evolução e sessões | Abas e abertura da sessão | PEDRO-01/02/03 |
| /prontuarios | Atalho legado para o prontuário demonstrativo | Abas e atalho de sessão | PEDRO-01 |
| /agenda | Dia/semana/mês e horários | Navegar datas, adicionar horário e mudar status | MARCO-02 |
| /sessoes | Entrada demonstrativa para a sessão contextualizada | Objetivos, anotações de apoio, transcrição e nota | PEDRO-03 |
| /documentos | Modelo/editor + papel de prévia | Modelo, revisão e histórico visual | PEDRO-04 |
| /financeiro | Indicadores, recebimentos e despesas | Abas, filtros, não identificados | PEDRO-05 |
| /comunicacao | Conversas + chat + consentimento | Troca de conversa e envio local | MARCO-03 |
| /notificacoes | Central de avisos | Marcar lida individual/todas | MARCO-04 |
| /offline | Fila, cópia Linux e conflitos | Simulação local | MARCO-05 |
| /configuracoes | Perfil, acesso e preferências | Formulários e opções | MARCO-01 |

## Limites desta entrega

Pacientes e eventos são explicitamente fictícios. As ações não criam registros no backend.
Sem envio de WhatsApp, PDF válido, diagnóstico automático, pagamentos ou sincronização reais.
Sem conteúdo clínico em post-it: a nota modelo é operacional. A nota clínica é criada somente dentro da sessão, na etapa de transcrição, e aparece no prontuário do paciente.
Crediário pertence ao Food, não ao Life.
Instalação Linux, criptografia e seleção de pasta ainda são pendências do offline.
Áudio/transcrição continuam fora da primeira versão, como previsto no PEDRO-03.
As tasks completas do backend permanecem abertas.

## Próximas etapas

- [ ] Aprovação visual/testes (não executados nesta etapa por solicitação do usuário).
- [ ] Completar formulários, edição e arquivamento; gráﬁcos de evolução e fluxo financeiro.
- [ ] Backend de pacientes/agenda e contratos com os módulos clínicos.
- [ ] Persistência de notas e preferências; notificações reais.
- [ ] Documentos/PDF, financeiro e offline com regras e auditoria.

## Arquivos de referência

- src/features/prototype/health-prototype.tsx: telas mock por módulo.
- src/components/shared/prototype-kit.tsx: componentes da prévia.
- src/components/shared/post-it-notes.tsx: mural flutuante.
- src/app/(authenticated)/agenda/page.tsx: agenda interativa local.
- src/components/shared/navigation.ts: mapa de navegação.
- public/mosaico-vitral.svg: vitral do cérebro de perfil.

Backend/servidor: [status consolidado](<../../Servidor Rotatix/STATUS-MOSAICO.md>).
