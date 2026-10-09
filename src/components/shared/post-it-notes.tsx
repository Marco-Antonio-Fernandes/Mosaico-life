"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Bell, CalendarClock, MessageSquare, X } from "lucide-react";
import { type LifeNotification } from "@/lib/life-notifications";

type NotificationItem = LifeNotification & {
  id: string;
  receivedAt: string;
};

function NotificationIcon({ kind }: { kind: LifeNotification["kind"] }) {
  if (kind === "payment") return <Banknote aria-hidden="true" className="size-4" />;
  if (kind === "reschedule") return <CalendarClock aria-hidden="true" className="size-4" />;
  if (kind === "message") return <MessageSquare aria-hidden="true" className="size-4" />;
  return <Bell aria-hidden="true" className="size-4" />;
}

// Avisos operacionais da sessão. A sincronização por usuário entra com a API.
export function PostItNotes() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "demo-message-notification",
      kind: "message",
      title: "Mensagem recebida",
      message: "Paciente exemplo A pediu confirmação do próximo horário.",
      receivedAt: "Agora",
    },
  ]);
  useEffect(() => {
    const receiveNotification = (event: Event) => {
      const notification = (event as CustomEvent<LifeNotification>).detail;
      if (!notification?.message) return;

      setNotifications((current) => [{
        ...notification,
        id: crypto.randomUUID(),
        receivedAt: "Agora",
      }, ...current.filter((item) => notification.kind !== "reschedule" || item.kind !== "reschedule")]);
    };

    window.addEventListener("mosaico-life:notification", receiveNotification);
    return () => window.removeEventListener("mosaico-life:notification", receiveNotification);
  }, []);

  const activeNotification = notifications.find((notification) => notification.kind === "reschedule") ?? notifications[0];
  if (!activeNotification) return null;
  const isPriority = activeNotification.kind === "reschedule";

  return (
    <aside aria-label={isPriority ? "Reagendamento pendente" : "Novo aviso"} className="notification-alert-layer">
      <article aria-live="assertive" className={`notification-alert notification-alert-${activeNotification.kind}${isPriority ? " is-priority" : ""}`} role="alert">
        <span className="notification-alert-icon" aria-hidden="true"><NotificationIcon kind={activeNotification.kind} /></span>
        <div className="notification-alert-copy">
          <span className="notification-alert-kicker">{isPriority ? "Prioridade · ação necessária" : "Novo aviso"}</span>
          <strong>{activeNotification.title}</strong>
          <p>{activeNotification.message}</p>
          <small>{activeNotification.receivedAt}</small>
          {isPriority && <Link className="notification-alert-action" href="/agenda">Abrir agenda para reagendar <ArrowRight aria-hidden="true" className="size-3.5" /></Link>}
        </div>
        {!isPriority && <button type="button" className="notification-alert-dismiss" aria-label={`Dispensar ${activeNotification.title}`} onClick={() => setNotifications(current => current.filter(item => item.id !== activeNotification.id))}><X aria-hidden="true" className="size-4" /></button>}
      </article>
    </aside>
  );
}
