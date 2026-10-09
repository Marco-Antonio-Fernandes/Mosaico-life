"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge, Metrics, Panel, Tabs } from "@/components/shared/prototype-kit";

type Appointment = { id: string; date: string; time: string; name: string; modality: string; status: string };
const dateKey = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
const initialDate = "2026-10-09";
export default function CalendarPage() {
  const [mode, setMode] = useState("Semana");
  const [date, setDate] = useState(initialDate);
  const [formOpen, setFormOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "a1", date: initialDate, time: "09:00", name: "Paciente exemplo A", modality: "Presencial", status: "Confirmado" },
    { id: "a2", date: initialDate, time: "14:00", name: "Paciente exemplo B", modality: "Online", status: "A confirmar" },
    { id: "a3", date: "2026-10-07", time: "11:00", name: "Paciente exemplo C", modality: "Presencial", status: "Concluído" },
  ]);
  const chosen = new Date(date + "T12:00:00");
  const start = new Date(chosen);
  if (mode === "Semana") start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  if (mode === "Mês") start.setDate(1);
  const count = mode === "Dia" ? 1 : mode === "Semana" ? 7 : new Date(chosen.getFullYear(), chosen.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: count }, (_, i) => { const day = new Date(start); day.setDate(day.getDate() + i); return day; });
  const shift = (direction: number) => {
    const next = new Date(chosen);
    if (mode === "Mês") { next.setDate(1); next.setMonth(next.getMonth() + direction); }
    else next.setDate(next.getDate() + direction * (mode === "Semana" ? 7 : 1));
    setDate(dateKey(next));
  };
  const visible = appointments.filter(item => days.some(day => dateKey(day) === item.date));
  return <div className="prototype"><p className="proto-demo">PRÉVIA VISUAL · Agenda fictícia. Nenhuma consulta, envio de confirmação ou gravação no servidor.</p><header className="proto-heading"><Badge>Atendimento</Badge><h1>Agenda</h1><p>Horários, disponibilidade e confirmações do acompanhamento psicológico.</p></header>
    <div className="proto-toolbar"><button type="button" className="proto-subtle" onClick={() => shift(-1)}>← Anterior</button><label>Data de referência<input type="date" value={date} onChange={event => { if (event.target.value) setDate(event.target.value); }} /></label><button type="button" className="proto-subtle" onClick={() => shift(1)}>Próximo →</button><button type="button" onClick={() => setFormOpen(!formOpen)}>Novo horário mock</button></div>
    <Tabs items={["Dia", "Semana", "Mês"]} value={mode} onChange={setMode} />
    {formOpen && <Panel title="Reservar horário de exemplo"><form className="proto-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setAppointments(current => [...current, { id: crypto.randomUUID(), date, time: String(data.get("time")), name: String(data.get("patient")), modality: String(data.get("modality")), status: "A confirmar" }]); setFormOpen(false); }}><label>Paciente<select name="patient"><option>Paciente exemplo A</option><option>Paciente exemplo B</option><option>Paciente exemplo C</option></select></label><label>Horário<input name="time" type="time" required defaultValue="10:00" /></label><label>Modalidade<select name="modality"><option>Presencial</option><option>Online</option><option>Bloqueio de horário</option></select></label><button type="submit">Adicionar à prévia</button></form></Panel>}
    <Metrics items={[["No período", String(visible.length), "Horários de exemplo"], ["Confirmados", String(visible.filter(item => item.status === "Confirmado").length), "Status simulado"], ["A confirmar", String(visible.filter(item => item.status === "A confirmar").length), "Sem envio de mensagem"]]} />
    <div className={mode === "Mês" ? "proto-calendar-month" : mode === "Semana" ? "proto-calendar-week" : "proto-stack"}>
      {days.map((day, index) => <section className="proto-calendar-day" key={dateKey(day)} style={mode === "Mês" && index === 0 ? { gridColumnStart: (day.getDay() + 6) % 7 + 1 } : undefined}><header><strong>{day.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" })}</strong><small>{day.toLocaleDateString("pt-BR", { month: "short" })}</small></header><div className="proto-stack">
        {appointments.filter(item => item.date === dateKey(day)).map(item => <article className="proto-ticket" key={item.id}><Badge>{item.time}</Badge><h3>{item.name}</h3><p>{item.modality} · {item.status}</p><Link className="proto-badge" href="/pacientes/p1?session=1">Abrir sessão →</Link><select aria-label={"Status de " + item.name} value={item.status} onChange={event => setAppointments(current => current.map(record => record.id === item.id ? { ...record, status: event.target.value } : record))}>{["A confirmar", "Confirmado", "Reagendado", "Falta", "Cancelado", "Concluído"].map(status => <option key={status}>{status}</option>)}</select></article>)}
        {!appointments.some(item => item.date === dateKey(day)) && <p className="proto-caption">Sem horários de exemplo</p>}
      </div></section>)}
    </div>
  </div>;
}
