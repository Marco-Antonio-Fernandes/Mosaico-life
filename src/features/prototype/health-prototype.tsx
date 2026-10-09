"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, Chat, Editor, Metrics, NotificationList, OfflinePreview, Panel, Preferences, Records, Tabs, type RecordItem } from "@/components/shared/prototype-kit";
import { PatientList, PatientWorkspace } from "@/features/prototype/patient-workspace";

const modules = {
  home: ["Seu dia em mosaico", "Agenda, cuidado e continuidade em uma única visão."],
  patients: ["Pacientes", "Contatos, etiquetas e histórico em um lugar."],
  clinical: ["Prontuários", "Uma visão organizada do acompanhamento psicológico."],
  demands: ["Demandas e evolução", "Objetivos, indicadores e histórico registrados pelo profissional."],
  sessions: ["Sessões", "Do acolhimento ao registro e à finalização."],
  documents: ["Documentos", "Modelos, revisão e versões dos documentos."],
  finance: ["Financeiro", "Sessões, recebimentos, despesas e valores não identificados."],
  communication: ["Comunicação", "Confirmações e orientações administrativas."],
  notifications: ["Notificações", "Acompanhe os acontecimentos importantes da rotina."],
  offline: ["Offline e sincronização", "Trabalho contínuo mesmo sem conexão."],
  settings: ["Configurações", "Perfil profissional, preferências e acesso."],
} as const;
type HealthModule = keyof typeof modules;
export function HealthPrototype({ module }: { module: HealthModule }) {
  return <div className="prototype"><header className="proto-heading"><Badge>Mosaico Life · psicologia</Badge><h1>{modules[module][0]}</h1><p>{modules[module][1]}</p></header>
    {module === "home" && <Home />}
    {module === "patients" && <PatientList />}
    {module === "clinical" && <PatientWorkspace patientId="p1" />}
    {module === "demands" && <PatientWorkspace patientId="p1" initialTab="Demandas" />}
    {module === "sessions" && <PatientWorkspace patientId="p1" initialSession />}
    {module === "documents" && <Documents />}
    {module === "finance" && <Finance />}
    {module === "communication" && <Chat health />}
    {module === "notifications" && <NotificationList health />}
    {module === "offline" && <OfflinePreview health />}
    {module === "settings" && <div className="proto-stack"><Editor title="Perfil profissional" tabs={["Perfil", "Preferências", "Acesso e permissões"]} labels={["Nome de exibição", "Registro profissional", "E-mail", "Duração padrão da sessão"]} /><Preferences groups={[{ title: "Rotina", labels: ["Lembrete de sessão próxima", "Aviso de confirmação", "Post-its na tela"] }, { title: "Privacidade e continuidade", labels: ["Bloqueio por inatividade", "Sincronização manual", "Revisão de conflitos"] }]} /><Panel title="Conta e segurança"><p>Acesso, recuperação e bloqueio de sessão são gerenciados nesta área.</p><Link className="proto-badge" href="/offline">Ver configuração offline do Linux →</Link></Panel></div>}
  </div>;
}
function Home() {
  return <div className="proto-stack"><Metrics items={[["Sessões hoje", "4", "2 confirmadas"], ["Pendências", "2", "Confirmação e recebimento"], ["Pacientes", "3", "Em acompanhamento"]]} />
    <div className="proto-two"><Panel title="Hoje na agenda" subtitle="Sua próxima etapa"><div className="proto-timeline">{[["09:00", "Mariana Alves", "Presencial · confirmado"], ["11:00", "Horário livre", "Janela para acolhimento"], ["14:00", "Rafael Costa", "Online · aguardando confirmação"], ["16:00", "Revisão da rotina", "Lembrete operacional"]].map(([time, name, detail]) => <article key={time}><Badge>{time}</Badge><h3>{name}</h3><p>{detail}</p></article>)}</div><Link className="proto-badge" href="/agenda">Abrir agenda completa →</Link></Panel>
    <div className="proto-stack"><Panel title="Continuar de onde parou"><div className="proto-stack">{[["Sessão em rascunho", "/pacientes/p1?session=1"], ["Documento para revisar", "/documentos"], ["Prontuário para revisar", "/pacientes/p1"]].map(([label, href]) => <Link className="proto-ticket" href={href} key={href}>{label} →</Link>)}</div></Panel><Panel title="Comunicação e organização"><p>Uma confirmação administrativa e um pedido de reagendamento aguardam atenção.</p><div className="proto-toolbar"><Link href="/comunicacao" className="proto-badge">Comunicação →</Link><Link href="/notificacoes" className="proto-badge">Notificações →</Link></div></Panel></div></div>
    <Panel title="Continuidade no Linux" subtitle="Disponível sem conexão"><p>Pacientes autorizados, agenda e fila de alterações ficam disponíveis conforme o plano de sincronização.</p><Link href="/offline" className="proto-badge">Abrir modo offline →</Link></Panel></div>;
}
function Documents() {
  const [model, setModel] = useState("Declaração de comparecimento");
  const [issued, setIssued] = useState(false);
  return <div className="proto-stack"><div className="proto-two"><Panel title="Preparar documento"><label>Modelo<select value={model} onChange={event => { setModel(event.target.value); setIssued(false); }}><option>Declaração de comparecimento</option><option>Atestado · modelo visual</option><option>Documento personalizado</option></select></label><Editor title="Conteúdo para revisão" tabs={["Rascunho", "Histórico de versões"]} labels={["Paciente", "Data", "Profissional"]} /><label className="proto-switch"><span>Revisei o documento</span><input type="checkbox" checked={issued} onChange={event => setIssued(event.target.checked)} /></label><p role="status">{issued ? "Revisão marcada." : "Revise o documento antes de emitir."}</p></Panel><Panel title="Documento"><div className="proto-paper"><h3>{model}</h3><p>DOCUMENTO</p><p style={{ marginTop: 28 }}>Paciente: [nome do paciente]</p><p>Data: [data selecionada]</p><p style={{ marginTop: 28 }}>O conteúdo será preenchido e revisado pelo profissional. Não há diagnóstico ou justificativa automática.</p><p style={{ marginTop: 50 }}>________________________________<br />Profissional responsável</p></div></Panel></div><Records title="Histórico de documentos" action="Novo rascunho" rows={[{ id: "d1", name: "Declaração de comparecimento", detail: "Mariana Alves · versão 1", status: "Rascunho", value: "Em revisão" }, { id: "d2", name: "Documento personalizado", detail: "Rafael Costa · versão 2", status: "Substituído", value: "Versão anterior" }]} /></div>;
}
function Finance() {
  const [tab, setTab] = useState("Recebimentos");
  const rows: RecordItem[] = tab === "Despesas" ? [{ id: "e1", name: "Sala de atendimento", detail: "Estrutura · recorrente", status: "Pago", value: "R$ 800,00" }, { id: "e2", name: "Material de escritório", detail: "Material · avulso", status: "Pendente", value: "R$ 90,00" }] : [{ id: "r1", name: "Mariana Alves", detail: "Sessão de acompanhamento · Pix", status: "Recebido", value: "R$ 180,00" }, { id: "r2", name: "Rafael Costa", detail: "Sessão de acompanhamento", status: "Pendente", value: "R$ 180,00" }, { id: "r3", name: "Recebimento sem vínculo", detail: "Identificação manual", status: "Não identificado", value: "R$ 180,00" }];
  return <><Metrics items={[["Previsto no mês", "R$ 5.400", "Sessões planejadas"], ["Recebido", "R$ 3.960", "Valores confirmados"], ["Pendente", "R$ 1.440", "Acompanhamento"]]} /><Tabs items={["Recebimentos", "Despesas", "Fluxo de caixa", "Não identificados"]} value={tab} onChange={setTab} /><Records key={tab} title={tab} action="Novo lançamento" fields={["Descrição / paciente", "Categoria / sessão", "Situação", "Valor"]} rows={tab === "Não identificados" ? rows.filter(row => row.status === "Não identificado") : rows} /></>;
}
