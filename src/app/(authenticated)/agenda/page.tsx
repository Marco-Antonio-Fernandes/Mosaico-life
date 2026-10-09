"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Plus, Video } from "lucide-react";
import { Badge, Metrics, Panel, Tabs } from "@/components/shared/prototype-kit";
import { dispatchLifeNotification } from "@/lib/life-notifications";

const appointmentStatuses = ["A confirmar", "Confirmado", "Reagendado", "Falta", "Cancelado", "Concluído"] as const;
type AppointmentStatus = typeof appointmentStatuses[number];
type Appointment = { id: string; date: string; time: string; name: string; patientId: string; modality: string; status: AppointmentStatus };

const dateKey = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
const initialDate = "2026-10-09";
const patientNames: Record<string, string> = { p1: "Paciente exemplo A", p2: "Paciente exemplo B", p3: "Paciente exemplo C" };

export default function CalendarPage() {
  const [mode, setMode] = useState("Semana");
  const [date, setDate] = useState(initialDate);
  const [formOpen, setFormOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "a1", date: initialDate, time: "09:00", name: "Paciente exemplo A", patientId: "p1", modality: "Presencial", status: "Confirmado" },
    { id: "a2", date: initialDate, time: "14:00", name: "Paciente exemplo B", patientId: "p2", modality: "Online", status: "A confirmar" },
    { id: "a3", date: "2026-10-07", time: "11:00", name: "Paciente exemplo C", patientId: "p3", modality: "Presencial", status: "Concluído" },
  ]);
  const chosen = new Date(date + "T12:00:00");
  const start = new Date(chosen);
  if (mode === "Semana") start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  if (mode === "Mês") start.setDate(1);
  const count = mode === "Dia" ? 1 : mode === "Semana" ? 7 : new Date(chosen.getFullYear(), chosen.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: count }, (_, index) => { const day = new Date(start); day.setDate(day.getDate() + index); return day; });
  const visible = appointments.filter((item) => days.some((day) => dateKey(day) === item.date));

  const shift = (direction: number) => {
    const next = new Date(chosen);
    if (mode === "Mês") { next.setDate(1); next.setMonth(next.getMonth() + direction); }
    else next.setDate(next.getDate() + direction * (mode === "Semana" ? 7 : 1));
    setDate(dateKey(next));
  };

  function changeStatus(appointment: Appointment, status: AppointmentStatus) {
    setAppointments((current) => current.map((item) => item.id === appointment.id ? { ...item, status } : item));
    setOpenStatus(null);
    if (status === "Reagendado") {
      dispatchLifeNotification({ kind: "reschedule", title: "Pedido de reagendamento", message: `${appointment.name} pediu para revisar o horário da sessão de ${appointment.time}.` });
    }
  }

  return <div className="prototype">
    <p className="proto-demo">PRÉVIA VISUAL · Agenda fictícia. Nenhuma consulta, mensagem, confirmação ou gravação é enviada.</p>
    <header className="proto-heading"><Badge>Atendimento</Badge><h1>Agenda</h1><p>Uma visão calma do dia, da semana e dos horários que precisam de atenção.</p></header>

    <section className="agenda-toolbar" aria-label="Controles da agenda">
      <div className="agenda-navigation">
        <button type="button" className="agenda-icon-button" aria-label="Período anterior" onClick={() => shift(-1)}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="proto-subtle agenda-today-button" onClick={() => setDate(initialDate)}>Hoje</button>
        <label className="agenda-date-field"><CalendarDays aria-hidden="true" />Data de referência<input type="date" value={date} onChange={(event) => { if (event.target.value) setDate(event.target.value); }} /></label>
        <button type="button" className="agenda-icon-button" aria-label="Próximo período" onClick={() => shift(1)}><ChevronRight aria-hidden="true" /></button>
      </div>
      <button type="button" className="agenda-new-button" onClick={() => setFormOpen(!formOpen)}><Plus aria-hidden="true" /> Novo horário mock</button>
    </section>

    <div className="agenda-view-switcher"><Tabs items={["Dia", "Semana", "Mês"]} value={mode} onChange={setMode} /><span className="agenda-period-label">{formatPeriod(chosen, mode)}</span></div>

    {formOpen && <Panel title="Reservar horário de exemplo" subtitle="A inclusão altera somente esta agenda de demonstração."><form className="agenda-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const patientId = String(data.get("patient")); setAppointments((current) => [...current, { id: crypto.randomUUID(), date, time: String(data.get("time")), name: patientNames[patientId], patientId, modality: String(data.get("modality")), status: "A confirmar" }]); setFormOpen(false); }}><label>Paciente<select name="patient"><option value="p1">Paciente exemplo A</option><option value="p2">Paciente exemplo B</option><option value="p3">Paciente exemplo C</option></select></label><label>Horário<input name="time" type="time" required defaultValue="10:00" /></label><label>Modalidade<select name="modality"><option>Presencial</option><option>Online</option><option>Bloqueio de horário</option></select></label><button type="submit">Adicionar à prévia</button></form></Panel>}

    <Metrics items={[["No período", String(visible.length), "Horários de exemplo"], ["Confirmados", String(visible.filter((item) => item.status === "Confirmado").length), "Status simulado"], ["A confirmar", String(visible.filter((item) => item.status === "A confirmar").length), "Sem envio de mensagem"]]} />

    <section className="agenda-board" aria-label={`Calendário em modo ${mode}`}>
      <div className={mode === "Mês" ? "proto-calendar-month" : mode === "Semana" ? "proto-calendar-week" : "agenda-day-view"}>
        {days.map((day, index) => {
          const dayAppointments = appointments.filter((item) => item.date === dateKey(day));
          const selected = dateKey(day) === date;
          return <section className={`proto-calendar-day agenda-day-card${selected ? " is-selected" : ""}`} key={dateKey(day)} style={mode === "Mês" && index === 0 ? { gridColumnStart: (day.getDay() + 6) % 7 + 1 } : undefined}>
            <header className="agenda-day-heading"><div><strong>{day.toLocaleDateString("pt-BR", { weekday: "long" })}</strong><span>{day.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</span></div><em>{dayAppointments.length} {dayAppointments.length === 1 ? "sessão" : "sessões"}</em></header>
            <div className="agenda-day-body">
              {dayAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} statusOpen={openStatus === appointment.id} onToggleStatus={() => setOpenStatus(openStatus === appointment.id ? null : appointment.id)} onChangeStatus={(status) => changeStatus(appointment, status)} />)}
              {!dayAppointments.length && <div className="agenda-empty"><Clock3 aria-hidden="true" /><p>Agenda livre</p><small>Você pode reservar um horário para este dia.</small></div>}
            </div>
          </section>;
        })}
      </div>
    </section>
  </div>;
}

function AppointmentCard({ appointment, statusOpen, onToggleStatus, onChangeStatus }: { appointment: Appointment; statusOpen: boolean; onToggleStatus: () => void; onChangeStatus: (status: AppointmentStatus) => void }) {
  const online = appointment.modality === "Online";
  return <article className={`agenda-appointment agenda-status-${statusSlug(appointment.status)}`}>
    <div className="agenda-appointment-top"><time>{appointment.time}</time><span className="agenda-modality">{online ? <Video aria-hidden="true" /> : <MapPin aria-hidden="true" />}{appointment.modality}</span></div>
    <div><h3>{appointment.name}</h3><p>{online ? "Atendimento por vídeo" : "Consultório principal"}</p></div>
    <div className="agenda-appointment-actions"><StatusPicker status={appointment.status} open={statusOpen} onToggle={onToggleStatus} onChange={onChangeStatus} /><Link className="agenda-open-link" href={`/pacientes/${appointment.patientId}?session=1`}>Abrir sessão <ChevronRight aria-hidden="true" /></Link></div>
  </article>;
}

function StatusPicker({ status, open, onToggle, onChange }: { status: AppointmentStatus; open: boolean; onToggle: () => void; onChange: (status: AppointmentStatus) => void }) {
  return <div className="agenda-status-picker"><button type="button" className="agenda-status-button" aria-expanded={open} onClick={onToggle}><span className={`agenda-status-dot agenda-status-dot-${statusSlug(status)}`} />{status}<ChevronDown aria-hidden="true" /></button>{open && <div className="agenda-status-menu" role="menu">{appointmentStatuses.map((option) => <button type="button" role="menuitem" key={option} className={option === status ? "is-current" : ""} onClick={() => onChange(option)}><span className={`agenda-status-dot agenda-status-dot-${statusSlug(option)}`} />{option}{option === status && <Check aria-hidden="true" />}</button>)}</div>}</div>;
}

function statusSlug(status: AppointmentStatus) {
  return status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-");
}

function formatPeriod(date: Date, mode: string) {
  if (mode === "Dia") return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  if (mode === "Mês") return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const start = new Date(date); start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`;
}
