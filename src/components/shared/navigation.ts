import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CalendarDays,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

export const navigationSections: NavigationSection[] = [
  {
    label: "Visão geral",
    items: [{ label: "Início", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Atendimento",
    items: [
      { label: "Pacientes", href: "/pacientes", icon: Users },
      { label: "Agenda", href: "/agenda", icon: CalendarDays },
    ],
  },
  {
    label: "Operação",
    items: [
      { label: "Comunicação", href: "/comunicacao", icon: MessageSquare },
      { label: "Documentos", href: "/documentos", icon: FileText },
      { label: "Financeiro", href: "/financeiro", icon: WalletCards },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Offline e sincronização", href: "/offline", icon: Cloud },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

export function getNavigationTitle(pathname: string): string {
  if (pathname === "/notificacoes") return "Notificações";

  const item = navigationSections
    .flatMap((section) => section.items)
    .find(({ href }) => href === pathname);

  return item?.label ?? "Mosaico Life";
}
