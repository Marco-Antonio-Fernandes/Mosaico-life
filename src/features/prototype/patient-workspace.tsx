"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Metrics, Panel, Tabs, type RecordItem } from "@/components/shared/prototype-kit";

export type Patient = {
  id: string;
  name: string;
  detail: string;
  status: string;
  value: string;
};

export const patients: Patient[] = [
  { id: "p1", name: "Mariana Alves", detail: "Adulto · presencial", status: "Em acompanhamento", value: "Próxima: 09h" },
  { id: "p2", name: "Rafael Costa", detail: "Adulto · online", status: "Em acompanhamento", value: "Próxima: 14h" },
  { id: "p3", name: "Luiza Martins", detail: "Contato administrativo", status: "Acolhimento", value: "A agendar" },
  { id: "p4", name: "Camila Rocha", detail: "Histórico preservado", status: "Arquivado", value: "Sem agenda" },
];

type ChartTab = "Resumo" | "Anotações" | "Demandas" | "Evolução" | "Sessões" | "Documentos" | "Financeiro";
type SessionResult = { note: string; demand?: string };

export function PatientList() {
  return <div className="proto-stack">
    <Metrics items={[["Pacientes ativos", "3", "Em acompanhamento"], ["Acolhimento", "1", "Contato recente"], ["Arquivados", "1", "Histórico preservado"]]} />
    <Panel title="Pacientes" subtitle="Abra um paciente para entrar diretamente no prontuário. Demandas, evolução e sessões ficam vinculadas a ele.">
      <div className="proto-patient-grid">
        {patients.map((patient) => <Link href={`/pacientes/${patient.id}`} className="proto-patient-card" key={patient.id}>
          <div className="flex items-start justify-between gap-3"><span className="proto-avatar">{patient.name.slice(-1)}</span><Badge>{patient.status}</Badge></div>
          <div><h3>{patient.name}</h3><p>{patient.detail}</p></div>
          <div className="flex items-center justify-between gap-3 text-sm"><span>{patient.value}</span><strong className="text-[var(--proto-accent)]">Abrir prontuário →</strong></div>
        </Link>)}
      </div>
    </Panel>
    <Panel title="Como funciona o fluxo" subtitle="Uma única entrada clínica por paciente.">
      <div className="proto-flow"><span>1 · Pacientes</span><span>2 · Prontuário</span><span>3 · Sessão</span><span>4 · Nota e demanda</span></div>
    </Panel>
  </div>;
}

export function PatientWorkspace({ patientId = "p1", initialTab = "Resumo", initialSession = false }: { patientId?: string; initialTab?: ChartTab; initialSession?: boolean }) {
  const patient = patients.find((item) => item.id === patientId) ?? patients[0];
  const [tab, setTab] = useState<ChartTab>(initialTab);
  const [screen, setScreen] = useState<"chart" | "session">(initialSession ? "session" : "chart");
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);

  if (screen === "session") return <SessionWorkspace patient={patient} onBack={() => setScreen("chart")} onComplete={(result) => { setSessionResult(result); setTab(result.demand ? "Demandas" : "Anotações"); setScreen("chart"); }} />;

  return <div className="proto-stack">
    <div className="proto-patient-header">
      <div><Link href="/pacientes" className="proto-subtle inline-flex items-center rounded-lg border px-3 py-2 text-sm">← Pacientes</Link><div className="mt-4 flex flex-wrap items-center gap-2"><Badge>Prontuário</Badge><Badge>{patient.status}</Badge><span className="proto-caption">{patient.detail}</span></div><h2 className="mt-3 text-2xl font-bold tracking-tight">{patient.name}</h2><p className="proto-caption">Tudo que é clínico deste paciente aparece aqui, inclusive notas criadas ao final das sessões.</p></div>
      <button type="button" onClick={() => setScreen("session")}>Abrir sessão de hoje</button>
    </div>
    <Metrics items={[["Próxima sessão", "09:00", "Hoje · presencial"], ["Demandas ativas", sessionResult?.demand ? "3" : "2", "Objetivos em acompanhamento"], ["Última evolução", sessionResult?.note ? "Agora" : "07/10/2026", "Registro atualizado"]]} />
    <Tabs items={["Resumo", "Anotações", "Demandas", "Evolução", "Sessões", "Documentos", "Financeiro"]} value={tab} onChange={(value) => setTab(value as ChartTab)} />
    {tab === "Resumo" && <ChartSummary patient={patient} sessionResult={sessionResult} onTab={setTab} />}
    {tab === "Anotações" && <ChartNotes patient={patient} sessionResult={sessionResult} />}
    {tab === "Demandas" && <ChartDemands sessionResult={sessionResult} />}
    {tab === "Evolução" && <ChartEvolution sessionResult={sessionResult} />}
    {tab === "Sessões" && <ChartSessions patient={patient} onOpenSession={() => setScreen("session")} />}
    {tab === "Documentos" && <ChartLinkedRecords title="Documentos do prontuário" rows={[{ id: "d1", name: "Declaração de comparecimento", detail: "Versão 1 · em revisão", status: "Rascunho", value: "07/10/2026" }]} />}
    {tab === "Financeiro" && <ChartLinkedRecords title="Financeiro vinculado" rows={[{ id: "f1", name: "Sessão de acompanhamento", detail: "Recebimento via Pix", status: "Recebido", value: "R$ 180,00" }]} />}
  </div>;
}

function ChartSummary({ patient, sessionResult, onTab }: { patient: Patient; sessionResult: SessionResult | null; onTab: (tab: ChartTab) => void }) {
  return <div className="proto-two"><Panel title="Acompanhamento" subtitle="Informações clínicas organizadas no prontuário"><div className="proto-timeline"><article><Badge>Objetivo ativo</Badge><h3>Organizar a rotina e reconhecer sinais de sobrecarga</h3><p>Estratégia preparada: revisar situações da semana e combinar um experimento possível.</p></article><article><Badge>Próxima sessão</Badge><h3>Hoje às 09:00 · {patient.name}</h3><p>Antes de começar, confira os objetivos e a estratégia já preparada.</p></article>{sessionResult?.note && <article><Badge>Atualizado nesta sessão</Badge><h3>Nota clínica criada na transcrição</h3><p>{sessionResult.note}</p></article>}</div></Panel><Panel title="Acesso rápido" subtitle="Tudo permanece dentro do prontuário deste paciente"><div className="proto-stack"><button type="button" className="proto-subtle" onClick={() => onTab("Anotações")}>Ver anotações clínicas →</button><button type="button" className="proto-subtle" onClick={() => onTab("Demandas")}>Ver demandas e tarefas →</button><button type="button" className="proto-subtle" onClick={() => onTab("Evolução")}>Ver evolução →</button><p className="proto-caption">A anotação de apoio da sessão só vira nota clínica depois da revisão/transcrição.</p></div></Panel></div>;
}

function ChartNotes({ patient, sessionResult }: { patient: Patient; sessionResult: SessionResult | null }) {
  return <div className="proto-stack"><Panel title="Anotações clínicas" subtitle={`Notas de ${patient.name} · criadas na revisão da sessão`}><div className="proto-note-list">{sessionResult?.note ? <article className="proto-clinical-note"><div className="flex flex-wrap items-center justify-between gap-3"><Badge>Nota criada agora</Badge><span className="proto-caption">Sessão de hoje · rascunho</span></div><p>{sessionResult.note}</p><small>Esta nota ficou vinculada ao paciente e à sessão. Ela não é o post-it operacional da tela.</small></article> : <article className="proto-clinical-note"><div className="flex flex-wrap items-center justify-between gap-3"><Badge>Nota clínica</Badge><span className="proto-caption">07/10/2026 · sessão anterior</span></div><p>Registro clínico criado após a revisão da sessão. O profissional decide o conteúdo final.</p><small>Novas notas nascem na etapa “Transcrever e registrar” da sessão.</small></article>}</div></Panel><Panel title="Regra do registro" subtitle="Apoio da sessão não é nota clínica"><p>Durante o atendimento, a médica escreve observações rápidas para não perder o raciocínio. Ao transcrever, ela revisa o que foi observado e decide se cria uma nota no prontuário.</p></Panel></div>;
}

function ChartDemands({ sessionResult }: { sessionResult: SessionResult | null }) {
  return <div className="proto-two"><Panel title="Demandas e objetivos" subtitle="Vinculados somente a este prontuário"><div className="proto-stack"><article className="proto-ticket"><Badge>Em acompanhamento</Badge><h3>Organizar a rotina e reconhecer sinais de sobrecarga</h3><p>Prioridade média · indicador definido pelo profissional.</p><strong>Estratégia: revisar situações da semana e combinar um experimento possível.</strong></article>{sessionResult?.demand && <article className="proto-ticket"><Badge>Nova tarefa da sessão</Badge><h3>{sessionResult.demand}</h3><p>Criada durante a transcrição da sessão de hoje · aguardando acompanhamento.</p></article>}</div></Panel><Panel title="Evolução relacionada" subtitle="O histórico não é sobrescrito"><div className="proto-timeline"><article><strong>07/10/2026 · objetivo atualizado</strong><p>Paciente identificou duas situações para observar durante a semana.</p></article><article><strong>Hoje · registro pendente de revisão</strong><p>A nova demanda só aparece aqui depois que a profissional confirmar na sessão.</p></article></div></Panel></div>;
}

function ChartEvolution({ sessionResult }: { sessionResult: SessionResult | null }) {
  return <Panel title="Linha de evolução" subtitle="Registros organizados por sessão e demanda"><div className="proto-timeline"><article><Badge>07/10/2026</Badge><h3>Objetivo em acompanhamento</h3><p>Indicador informado pelo profissional: testar uma mudança pequena na rotina.</p></article><article><Badge>Hoje</Badge><h3>{sessionResult?.note ? "Nota criada após transcrição" : "Sessão prevista para registrar evolução"}</h3><p>{sessionResult?.note ?? "Durante a sessão, as observações ficam em rascunho até a revisão final."}</p></article></div></Panel>;
}

function ChartSessions({ patient, onOpenSession }: { patient: Patient; onOpenSession: () => void }) {
  return <div className="proto-two"><Panel title="Histórico de sessões" subtitle={`Sessões vinculadas a ${patient.name}`}><div className="proto-stack"><article className="proto-ticket"><div className="flex flex-wrap items-center justify-between gap-3"><div><Badge>Hoje · 09:00</Badge><h3 className="mt-2">Sessão de acompanhamento</h3><p>Presencial · ainda não iniciada</p></div><button type="button" onClick={onOpenSession}>Abrir atendimento</button></div></article><article className="proto-ticket"><Badge>07/10/2026 · concluída</Badge><h3>Sessão de acompanhamento</h3><p>Nota clínica vinculada ao prontuário.</p></article></div></Panel><Panel title="Como a sessão funciona"><ol className="proto-list"><li>Conferir objetivos e estratégia do paciente.</li><li>Anotar observações de apoio durante a conversa.</li><li>Transcrever e refletir depois do atendimento.</li><li>Criar a nota clínica e, se necessário, uma demanda/tarefa.</li></ol></Panel></div>;
}

function ChartLinkedRecords({ title, rows }: { title: string; rows: RecordItem[] }) {
  return <Panel title={title} subtitle="Registros relacionados ao paciente"><div className="proto-stack">{rows.map((row) => <article className="proto-ticket" key={row.id}><div className="flex flex-wrap items-center justify-between gap-3"><div><h3>{row.name}</h3><p>{row.detail}</p></div><Badge>{row.status}</Badge><strong>{row.value}</strong></div></article>)}</div></Panel>;
}

function SessionWorkspace({ patient, onBack, onComplete }: { patient: Patient; onBack: () => void; onComplete: (result: SessionResult) => void }) {
  const [phase, setPhase] = useState<"atendimento" | "transcricao">("atendimento");
  const [supportNotes, setSupportNotes] = useState("");
  const [clinicalNote, setClinicalNote] = useState("");
  const [demand, setDemand] = useState("");
  const [strategy, setStrategy] = useState("Revisar situações da semana e combinar um experimento possível.");
  const [strategyReady, setStrategyReady] = useState(true);

  function appendObservation(text: string) {
    setSupportNotes((current) => current ? `${current}\n${text}` : text);
  }

  return <div className="proto-stack"><div className="proto-session-header"><div><button type="button" className="proto-subtle" onClick={onBack}>← Voltar ao prontuário</button><div className="mt-4 flex flex-wrap items-center gap-2"><Badge>Sessão em andamento</Badge><Badge>{patient.name}</Badge></div><h2 className="mt-3 text-2xl font-bold tracking-tight">Atendimento de hoje</h2><p className="proto-caption">As observações ficam em rascunho durante a conversa. A nota clínica só é criada na transcrição.</p></div><Badge>{phase === "atendimento" ? "Atendimento" : "Transcrição"}</Badge></div>
    <Metrics items={[["Paciente", patient.name, "Prontuário aberto"], ["Horário", "09:00 · 50 min", "Presencial"], ["Objetivos", "2 ativos", "Prontos para revisar"]]} />
    <Panel title="Objetivos e estratégia" subtitle="O que a médica consulta antes e durante a sessão"><div className="proto-two"><div className="proto-ticket"><Badge>Objetivo principal</Badge><h3>Organizar a rotina e reconhecer sinais de sobrecarga</h3><p>Observe situações concretas da semana e combine um próximo passo possível.</p></div><div className="proto-ticket"><Badge>{strategyReady ? "Estratégia preparada" : "Sem estratégia preparada"}</Badge>{strategyReady ? <p>{strategy}</p> : <p>Quando ainda não houver estratégia, ela pode ser pensada aqui antes de começar.</p>}<button type="button" className="proto-subtle" onClick={() => { setStrategyReady(!strategyReady); setStrategy(strategyReady ? "" : "Revisar situações da semana e combinar um experimento possível."); }}>{strategyReady ? "Reabrir planejamento" : "Preparar estratégia"}</button></div></div></Panel>
    {phase === "atendimento" ? <div className="proto-two"><Panel title="Anotações de apoio" subtitle="Escrita rápida durante a conversa · ainda não é uma nota clínica"><div className="proto-toolbar"><button type="button" className="proto-subtle" onClick={() => appendObservation("Paciente trouxe uma situação da semana para explorar · observação de apoio.")}>Inserir observação</button></div><textarea rows={12} value={supportNotes} onChange={(event) => setSupportNotes(event.target.value)} placeholder="Anote palavras-chave, fatos e hipóteses para retomar na transcrição…" /><p className="proto-caption">O conteúdo desta área será mostrado na próxima etapa para ajudar a médica a pensar e escrever.</p></Panel><Panel title="Roteiro do atendimento"><ol className="proto-list"><li>Conferir objetivos e estratégia.</li><li>Escutar e registrar observações de apoio.</li><li>Retomar demandas que já estão no prontuário.</li><li>Encerrar o atendimento e revisar o registro.</li></ol><button type="button" onClick={() => setPhase("transcricao")}>Encerrar e transcrever →</button><p className="proto-caption">Nada foi criado no prontuário ainda.</p></Panel></div> : <TranscriptionWorkspace supportNotes={supportNotes} clinicalNote={clinicalNote} setClinicalNote={setClinicalNote} demand={demand} setDemand={setDemand} onBack={() => setPhase("atendimento")} onComplete={() => onComplete({ note: clinicalNote.trim(), demand: demand.trim() || undefined })} />}
  </div>;
}

function TranscriptionWorkspace({ supportNotes, clinicalNote, setClinicalNote, demand, setDemand, onBack, onComplete }: { supportNotes: string; clinicalNote: string; setClinicalNote: (value: string) => void; demand: string; setDemand: (value: string) => void; onBack: () => void; onComplete: () => void }) {
  const canSave = clinicalNote.trim().length > 0;
  return <div className="proto-stack"><div className="proto-transcription-banner"><Badge>Etapa 2 · revisão</Badge><p>Agora a médica olha as próprias anotações, transcreve o raciocínio e decide o que realmente deve entrar no prontuário.</p></div><div className="proto-two"><Panel title="Anotações de apoio da sessão" subtitle="Somente referência para a transcrição"><div className="proto-source-notes">{supportNotes || "Nenhuma observação foi escrita. A médica pode registrar uma nota clínica manualmente abaixo."}</div><p className="proto-caption">Estas observações não são publicadas como nota automaticamente.</p></Panel><Panel title="Nota clínica" subtitle="É aqui que a nota é criada e vinculada ao paciente e à sessão"><label className="proto-editor-label">O que foi observado e pensado<textarea rows={13} value={clinicalNote} onChange={(event) => setClinicalNote(event.target.value)} placeholder="Revise as observações e escreva a nota clínica que deve ficar no prontuário…" /></label><p className="proto-caption">A profissional decide o conteúdo final. O sistema não diagnostica nem transforma o rascunho sozinho.</p></Panel></div><Panel title="Criar demanda ou tarefa" subtitle="Opcional · nasce da reflexão da sessão e volta a aparecer no prontuário"><div className="proto-form"><label>Título da demanda/tarefa<input value={demand} onChange={(event) => setDemand(event.target.value)} placeholder="Ex.: observar sinais de sobrecarga durante a semana" /></label><div><p className="proto-caption">Ao confirmar, ela ficará na aba Demandas do paciente.</p>{demand.trim() && <Badge>Será vinculada ao prontuário</Badge>}</div></div></Panel><div className="proto-toolbar"><button type="button" className="proto-subtle" onClick={onBack}>← Voltar às anotações</button><button type="button" disabled={!canSave} onClick={onComplete}>Criar nota e finalizar sessão</button><span className="proto-caption">{canSave ? "A nota será criada somente após esta confirmação." : "Escreva a nota clínica para finalizar."}</span></div></div>;
}
