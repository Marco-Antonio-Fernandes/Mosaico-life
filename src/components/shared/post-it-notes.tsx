"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Banknote, Bell, CalendarClock, ChevronUp, MessageSquare, Plus, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type LifeNotification } from "@/lib/life-notifications";

type Note = { id: string; title?: string; message: string; kind: "note" | "reminder" | "message" | "payment" | "reschedule"; color: number };

const noteColors = [
  { name: "Amarelo", background: "#ffe580", foreground: "#463611" },
  { name: "Rosa", background: "#ffadd0", foreground: "#53243c" },
  { name: "Lilás", background: "#cbb0ff", foreground: "#382556" },
  { name: "Azul", background: "#99daff", foreground: "#193c55" },
  { name: "Verde", background: "#b4efa1", foreground: "#26451d" },
  { name: "Pêssego", background: "#ffbd91", foreground: "#542d19" },
];

// Notas operacionais da sessão. A sincronização por usuário entra com a API.
export function PostItNotes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "demo-welcome-note", kind: "reminder", color: 0, message: "Lembrete de exemplo\n\nReserve 15 minutos ao final do dia para organizar a agenda de amanhã e revisar suas pendências.\n\nVocê pode criar outra nota ou dispensar esta." },
  ]);
  const [expanded, setExpanded] = useState(true);
  const [composing, setComposing] = useState(false);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<Note["kind"]>("note");

  useEffect(() => {
    const firstColor = Math.floor(Math.random() * noteColors.length);
    setNotes(current => current.map((note, index) => ({ ...note, color: (firstColor + index) % noteColors.length })));
  }, []);

  useEffect(() => {
    const receiveNotification = (event: Event) => {
      const notification = (event as CustomEvent<LifeNotification>).detail;
      if (!notification?.message) return;
      setNotes((current) => [{ id: crypto.randomUUID(), title: notification.title, message: notification.message, kind: notification.kind, color: ((current[0]?.color ?? -1) + 1) % noteColors.length }, ...current]);
      setExpanded(true);
      setComposing(false);
    };
    window.addEventListener("mosaico-life:notification", receiveNotification);
    return () => window.removeEventListener("mosaico-life:notification", receiveNotification);
  }, []);

  function toggleNotes() {
    if (!expanded) {
      setNotes(current => current.map(note => ({ ...note, color: (note.color + 1) % noteColors.length })));
    }
    setExpanded(!expanded);
    setComposing(false);
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setNotes((current) => [{ id: crypto.randomUUID(), message: message.trim(), kind, color: ((current[0]?.color ?? -1) + 1) % noteColors.length }, ...current]);
    setMessage("");
    setComposing(false);
    setExpanded(true);
  }

  return (
    <aside aria-label="Notas e lembretes" className="pointer-events-none fixed right-3 top-20 z-40 w-[min(25rem,calc(100vw-1.5rem))] sm:right-6">
      <div className="flex justify-end gap-2">
        <Button
          aria-controls="floating-notes"
          aria-expanded={expanded}
          className="pointer-events-auto min-h-11 border-amber-200/40 bg-card shadow-lg"
          variant="secondary"
          onClick={toggleNotes}
        >
          <StickyNote aria-hidden="true" className="size-4 text-amber-200" />
          Notas{notes.length ? ` (${notes.length})` : ""}
          {expanded ? <ChevronUp aria-hidden="true" className="size-4" /> : null}
        </Button>
      </div>
      {expanded ? (
        <div id="floating-notes" className="pointer-events-auto mt-3 max-h-[calc(100dvh-9rem)] space-y-4 overflow-y-auto overscroll-contain rounded-2xl p-1">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-lg">
            <p className="text-sm font-semibold">Seu mural</p>
            <Button className="min-h-11" size="sm" onClick={() => setComposing(!composing)} aria-expanded={composing}>
              <Plus aria-hidden="true" className="size-4" /> Nova nota
            </Button>
          </div>
          {composing ? (
            <form onSubmit={addNote} className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-xl">
              <label className="block text-sm font-semibold" htmlFor="note-kind">Tipo</label>
              <select id="note-kind" className="min-h-11 w-full rounded-lg border border-border bg-background px-3" value={kind} onChange={(event) => setKind(event.target.value === "reminder" ? "reminder" : "note")}>
                <option value="note">Nota</option>
                <option value="reminder">Lembrete</option>
              </select>
              <label className="block text-sm font-semibold" htmlFor="note-message">Mensagem</label>
              <textarea id="note-message" required maxLength={600} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} className="w-full resize-y rounded-lg border border-border bg-background p-3 text-base" placeholder="Escreva um lembrete para sua rotina…" />
              <p className="text-xs text-muted-foreground">Disponível nesta sessão. Ainda não sincroniza com sua conta.</p>
              <div className="flex flex-wrap justify-end gap-2">
                <Button className="min-h-11" variant="ghost" onClick={() => setComposing(false)}>Cancelar</Button>
                <Button className="min-h-11" type="submit" disabled={!message.trim()}>Colocar no mural</Button>
              </div>
            </form>
          ) : null}
          {!notes.length && !composing ? <p className="rounded-2xl border border-amber-200/40 bg-[#f8e8a5] p-6 text-base leading-7 text-[#493b23] shadow-xl">Suas notas e lembretes aparecem aqui, por cima da página. Use “Nova nota” para escrever uma mensagem.</p> : null}
          <div aria-live="polite" aria-relevant="additions" className="space-y-4">
            {notes.map((note) => (
              <article key={note.id} style={{ backgroundColor: noteColors[note.color].background, color: noteColors[note.color].foreground }} className="relative overflow-hidden rounded-[3px_3px_24px_3px] border border-black/10 p-5 shadow-[0_12px_28px_#00000040] sm:p-6">
                <div aria-hidden="true" className="absolute bottom-0 right-0 size-6 bg-black/10 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-black/15 pb-3">
                  <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    {note.kind === "reminder" ? <Bell aria-hidden="true" className="size-5" /> : note.kind === "message" ? <MessageSquare aria-hidden="true" className="size-5" /> : note.kind === "payment" ? <Banknote aria-hidden="true" className="size-5" /> : note.kind === "reschedule" ? <CalendarClock aria-hidden="true" className="size-5" /> : <StickyNote aria-hidden="true" className="size-5" />}
                    {note.title ?? (note.kind === "reminder" ? "Lembrete" : note.kind === "message" ? "Mensagem recebida" : note.kind === "payment" ? "Pix recebido" : note.kind === "reschedule" ? "Reagendamento" : "Nota")}
                  </h2>
                  <button type="button" aria-label="Dispensar esta nota" onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline focus-visible:outline-2">
                    <X aria-hidden="true" className="size-5" />
                  </button>
                </div>
                <p className="whitespace-pre-wrap break-words text-lg font-medium leading-8">{note.message}</p>
                <button type="button" className="mt-4 min-h-11 rounded-lg border border-black/15 px-3 text-sm font-semibold hover:bg-black/10 focus-visible:outline focus-visible:outline-2" aria-label={"Trocar cor da nota, atualmente " + noteColors[note.color].name} onClick={() => setNotes(current => current.map(item => item.id === note.id ? { ...item, color: (item.color + 1) % noteColors.length } : item))}>
                  Trocar cor · {noteColors[note.color].name}
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
