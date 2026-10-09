"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Plus, Settings2, Video, X } from "lucide-react";
import { Badge, Metrics, Panel, Tabs } from "@/components/shared/prototype-kit";
import { dispatchLifeNotification } from "@/lib/life-notifications";

const appointmentStatuses = ["A confirmar", "Confirmado", "Reagendado", "Falta", "Cancelado", "Concluído"] as const;
type AppointmentStatus = typeof appointmentStatuses[number];
type Appointment = { id: string; date: string; time: string; name: string; patientId: string; modality: string; status: AppointmentStatus };

const dateKey = (date: Date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
const initialDate = "2026-10-09";
const patientNames: Record<string, string> = { p1: "Mariana Alves", p2: "Rafael Costa", p3: "Luiza Martins" };
const holidays: Record<string, string> = {
  "2026-01-01": "Confraternização Universal",
  "2026-04-03": "Paixão de Cristo",
  "2026-04-21": "Tiradentes",
  "2026-05-01": "Dia Mundial do Trabalho",
  "2026-09-07": "Independência do Brasil",
  "2026-10-12": "Nossa Senhora Aparecida",
  "2026-11-02": "Finados",
  "2026-11-15": "Proclamação da República",
  "2026-11-20": "Dia da Consciência Negra",
  "2026-12-25": "Natal",
};
const weekdayOptions = [
  { value: 1, label: "Segunda-feira", shortLabel: "Seg" },
  { value: 2, label: "Terça-feira", shortLabel: "Ter" },
  { value: 3, label: "Quarta-feira", shortLabel: "Qua" },
  { value: 4, label: "Quinta-feira", shortLabel: "Qui" },
  { value: 5, label: "Sexta-feira", shortLabel: "Sex" },
  { value: 6, label: "Sábado", shortLabel: "Sáb" },
  { value: 0, label: "Domingo", shortLabel: "Dom" },
];

export default function CalendarPage() {
  const [mode, setMode] = useState("Semana");
  const [date, setDate] = useState(initialDate);
  const [formOpen, setFormOpen] = useState(false);
  const [weekdayEditorOpen, setWeekdayEditorOpen] = useState(false);
  const [hiddenWeekdays, setHiddenWeekdays] = useState<number[]>([]);
  const [scheduleNotice, setScheduleNotice] = useState("");
  const [openStatus, setOpenStatus] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "a1", date: initialDate, time: "09:00", name: "Mariana Alves", patientId: "p1", modality: "Presencial", status: "Confirmado" },
    { id: "a2", date: initialDate, time: "14:00", name: "Rafael Costa", patientId: "p2", modality: "Online", status: "A confirmar" },
    { id: "a3", date: "2026-10-07", time: "11:00", name: "Luiza Martins", patientId: "p3", modality: "Presencial", status: "Concluído" },
    { id: "a4", date: initialDate, time: "10:00", name: "Luiza Martins", patientId: "p3", modality: "Presencial", status: "A confirmar" },
    { id: "a5", date: initialDate, time: "11:00", name: "Mariana Alves", patientId: "p1", modality: "Online", status: "Confirmado" },
    { id: "a6", date: initialDate, time: "13:00", name: "Rafael Costa", patientId: "p2", modality: "Presencial", status: "A confirmar" },
    { id: "a7", date: initialDate, time: "15:00", name: "Luiza Martins", patientId: "p3", modality: "Online", status: "Confirmado" },
    { id: "a8", date: initialDate, time: "16:00", name: "Mariana Alves", patientId: "p1", modality: "Presencial", status: "A confirmar" },
  ]);
  const chosen = new Date(date + "T12:00:00");
  const start = new Date(chosen);
  if (mode === "Semana") start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  if (mode === "Mês") start.setDate(1);
  const count = mode === "Dia" ? 1 : mode === "Semana" ? 7 : new Date(chosen.getFullYear(), chosen.getMonth() + 1, 0).getDate();
  const allDays = Array.from({ length: count }, (_, index) => { const day = new Date(start); day.setDate(day.getDate() + index); return day; });
  const days = mode === "Semana" ? allDays.filter(day => !hiddenWeekdays.includes(day.getDay())) : allDays;
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

  function toggleWeekday(weekday: number) {
    setHiddenWeekdays(current => current.includes(weekday) ? current.filter(item => item !== weekday) : [...current, weekday]);
  }

  function hideWeekday(weekday: number) {
    setHiddenWeekdays(current => current.includes(weekday) ? current : [...current, weekday]);
  }

  function changeReferenceDate(nextDate: string) {
    if (!nextDate) return;
    setDate(nextDate);
    setScheduleNotice("");
    if (holidays[nextDate]) setFormOpen(false);
  }

  function openDay(day: Date) {
    setDate(dateKey(day));
    setMode("Dia");
    setOpenStatus(null);
  }

  return <div className="prototype">
    <header className="proto-heading"><Badge>Atendimento</Badge><h1>Agenda</h1><p>Uma visão calma do dia, da semana e dos horários que precisam de atenção.</p></header>

    <section className="agenda-toolbar" aria-label="Controles da agenda">
      <div className="agenda-navigation">
        <button type="button" className="agenda-icon-button" aria-label="Período anterior" onClick={() => shift(-1)}><ChevronLeft aria-hidden="true" /></button>
        <button type="button" className="proto-subtle agenda-today-button" onClick={() => setDate(initialDate)}>Hoje</button>
        <label className="agenda-date-field"><CalendarDays aria-hidden="true" />Data de referência<input type="date" value={date} onChange={(event) => changeReferenceDate(event.target.value)} /></label>
        <button type="button" className="agenda-icon-button" aria-label="Próximo período" onClick={() => shift(1)}><ChevronRight aria-hidden="true" /></button>
      </div>
      <div className="agenda-toolbar-actions"><button type="button" className="proto-subtle agenda-edit-days-button" onClick={() => setWeekdayEditorOpen(!weekdayEditorOpen)}><Settings2 aria-hidden="true" /> Editar dias</button><button type="button" className="agenda-new-button" onClick={() => setFormOpen(!formOpen)}><Plus aria-hidden="true" /> Novo horário</button></div>
    </section>

    {holidays[date] && <div className="agenda-holiday-banner" role="status"><CalendarDays aria-hidden="true" /><div><strong>Feriado identificado: {holidays[date]}</strong><span>Novos horários ficam bloqueados nesta data.</span></div></div>}

    <div className="agenda-view-switcher"><Tabs items={["Dia", "Semana", "Mês"]} value={mode} onChange={setMode} /><span className="agenda-period-label">{formatPeriod(chosen, mode)}</span></div>

    {weekdayEditorOpen && <Panel title="Dias de trabalho" subtitle="Escolha quais colunas aparecem na visão semanal. Ocultar um dia não apaga seus atendimentos."><div className="agenda-weekday-editor">{weekdayOptions.map(option => <label className="agenda-weekday-option" key={option.value}><input type="checkbox" checked={!hiddenWeekdays.includes(option.value)} onChange={() => toggleWeekday(option.value)} /><span><strong>{option.label}</strong><small>{hiddenWeekdays.includes(option.value) ? "Oculto na semana" : "Exibido na semana"}</small></span></label>)}</div><div className="agenda-editor-footer"><p>Profissionais podem manter somente os dias em que atendem.</p><button type="button" className="proto-subtle" onClick={() => setHiddenWeekdays([])}>Restaurar todos os dias</button></div></Panel>}

    {formOpen && <Panel title="Reservar horário" subtitle="Informe os dados para reservar o horário.">{holidays[date] && <div className="agenda-holiday-warning" role="alert"><strong>Agendamento bloqueado</strong><span>{holidays[date]} não permite novos horários.</span></div>}<form className="agenda-form" onSubmit={(event) => { event.preventDefault(); if (holidays[date]) { setScheduleNotice(`Não é possível agendar em ${holidays[date]}.`); return; } const data = new FormData(event.currentTarget); const patientId = String(data.get("patient")); setAppointments((current) => [...current, { id: crypto.randomUUID(), date, time: String(data.get("time")), name: patientNames[patientId], patientId, modality: String(data.get("modality")), status: "A confirmar" }]); setScheduleNotice("Horário adicionado."); setFormOpen(false); }}><label>Paciente<select disabled={Boolean(holidays[date])} name="patient"><option value="p1">Mariana Alves</option><option value="p2">Rafael Costa</option><option value="p3">Luiza Martins</option></select></label><label>Horário<input disabled={Boolean(holidays[date])} name="time" type="time" required defaultValue="10:00" /></label><label>Modalidade<select disabled={Boolean(holidays[date])} name="modality"><option>Presencial</option><option>Online</option><option>Bloqueio de horário</option></select></label><button disabled={Boolean(holidays[date])} type="submit">Adicionar horário</button></form>{scheduleNotice && <p className="agenda-form-notice" role="status">{scheduleNotice}</p>}</Panel>}

    <Metrics items={[["No período", String(visible.length), "Horários"], ["Confirmados", String(visible.filter((item) => item.status === "Confirmado").length), "Status"], ["A confirmar", String(visible.filter((item) => item.status === "A confirmar").length), "Mensagens pendentes"]]} />

    <section className="agenda-board" aria-label={`Calendário em modo ${mode}`}>
      <div className={mode === "Mês" ? "proto-calendar-month" : mode === "Semana" ? "proto-calendar-week" : "agenda-day-view"}>
        {!days.length && <div className="agenda-no-days"><Settings2 aria-hidden="true" /><strong>Nenhum dia está sendo exibido</strong><p>Reative pelo menos um dia no painel “Editar dias”.</p><button type="button" onClick={() => setHiddenWeekdays([])}>Mostrar todos os dias</button></div>}
        {days.map((day, index) => {
          const dayAppointments = appointments.filter((item) => item.date === dateKey(day));
          const selected = dateKey(day) === date;
          const holidayName = holidays[dateKey(day)];
          const monthDay = mode === "Mês";
          return <section className={`proto-calendar-day agenda-day-card${selected ? " is-selected" : ""}${holidayName ? " is-holiday" : ""}${monthDay ? " is-month-clickable" : ""}`} key={dateKey(day)} onClick={monthDay ? () => openDay(day) : undefined} onKeyDown={monthDay ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDay(day); } } : undefined} role={monthDay ? "button" : undefined} tabIndex={monthDay ? 0 : undefined} style={monthDay && index === 0 ? { gridColumnStart: (day.getDay() + 6) % 7 + 1 } : undefined}>
            <header className="agenda-day-heading"><div><strong>{day.toLocaleDateString("pt-BR", { weekday: "long" })}</strong><span>{day.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</span></div><div className="agenda-day-heading-actions">{holidayName && <span className="agenda-holiday-label">Feriado</span>}<em>{dayAppointments.length} {dayAppointments.length === 1 ? "sessão" : "sessões"}</em>{mode === "Semana" && <button type="button" className="agenda-day-remove" aria-label={`Ocultar ${day.toLocaleDateString("pt-BR", { weekday: "long" })}`} onClick={() => hideWeekday(day.getDay())}><X aria-hidden="true" /></button>}</div></header>
            <div className="agenda-day-body">
              {holidayName && <div className="agenda-day-holiday"><strong>{holidayName}</strong><small>Novos agendamentos bloqueados</small></div>}
              {dayAppointments.map((appointment) => mode === "Dia" ? <AppointmentCard key={appointment.id} appointment={appointment} statusOpen={openStatus === appointment.id} onToggleStatus={() => setOpenStatus(openStatus === appointment.id ? null : appointment.id)} onChangeStatus={(status) => changeStatus(appointment, status)} /> : <CompactAppointmentRow key={appointment.id} appointment={appointment} statusOpen={openStatus === appointment.id} onToggleStatus={() => setOpenStatus(openStatus === appointment.id ? null : appointment.id)} onChangeStatus={(status) => changeStatus(appointment, status)} />)}
              {!dayAppointments.length && !holidayName && <div className="agenda-empty"><Clock3 aria-hidden="true" /><p>Agenda livre</p><small>Você pode reservar um horário para este dia.</small></div>}
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
    <Link className="agenda-appointment-main" href={`/pacientes/${appointment.patientId}?session=1`}><div className="agenda-appointment-top"><time>{appointment.time}</time><span className="agenda-modality">{online ? <Video aria-hidden="true" /> : <MapPin aria-hidden="true" />}{appointment.modality}</span></div>
    <div><h3>{appointment.name}</h3><p>{online ? "Atendimento por vídeo" : "Consultório principal"}</p></div></Link>
    <div className="agenda-appointment-status"><StatusPicker status={appointment.status} open={statusOpen} onToggle={onToggleStatus} onChange={onChangeStatus} /></div><Link className="agenda-open-link" href={`/pacientes/${appointment.patientId}?session=1`}><span className="agenda-open-link-content"><span className="agenda-open-link-kicker">Próximo passo</span><span className="agenda-open-link-label">Abrir sessão</span></span><ChevronRight aria-hidden="true" /></Link>
  </article>;
}

function CompactAppointmentRow({ appointment, statusOpen, onToggleStatus, onChangeStatus }: { appointment: Appointment; statusOpen: boolean; onToggleStatus: () => void; onChangeStatus: (status: AppointmentStatus) => void }) {
  const online = appointment.modality === "Online";
  return <article className={`agenda-compact-appointment agenda-status-${statusSlug(appointment.status)}`} title={`${appointment.time} · ${appointment.name}`}>
    <Link className="agenda-compact-patient" href={`/pacientes/${appointment.patientId}?session=1`}><time>{appointment.time}</time><span><strong>{appointment.name}</strong><small>{online ? "Online" : "Presencial"}</small></span></Link>
    <StatusPicker compact status={appointment.status} open={statusOpen} onToggle={onToggleStatus} onChange={onChangeStatus} />
  </article>;
}

function StatusPicker({ status, open, onToggle, onChange, compact = false }: { status: AppointmentStatus; open: boolean; onToggle: () => void; onChange: (status: AppointmentStatus) => void; compact?: boolean }) {
  return <div className="agenda-status-picker" onClick={(event) => event.stopPropagation()}><button type="button" className={`agenda-status-button agenda-status-button-${statusSlug(status)}${compact ? " is-compact" : ""}`} aria-label={compact ? `Status: ${status}` : undefined} aria-expanded={open} aria-haspopup="menu" onClick={onToggle}><span className={`agenda-status-dot agenda-status-dot-${statusSlug(status)}`} />{!compact && status}<ChevronDown aria-hidden="true" /></button>{open && <div className="agenda-status-menu" role="menu">{appointmentStatuses.map((option) => <button type="button" role="menuitemradio" aria-checked={option === status} key={option} className={option === status ? "is-current" : ""} onClick={() => onChange(option)}><span className={`agenda-status-dot agenda-status-dot-${statusSlug(option)}`} />{option}{option === status && <Check aria-hidden="true" />}</button>)}</div>}</div>;
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
