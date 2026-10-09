import { Cloud, CloudCog, CloudUpload } from "lucide-react";

type SyncStatusValue = "idle" | "pending" | "syncing";

type SyncStatusProps = {
  status: SyncStatusValue;
};

const statusContent: Record<SyncStatusValue, { label: string; description: string }> = {
  idle: { label: "Sincronização em espera", description: "Nenhuma operação local aguardando envio." },
  pending: { label: "Alterações pendentes", description: "As alterações serão enviadas quando possível." },
  syncing: { label: "Sincronizando", description: "As alterações estão sendo enviadas com segurança." },
};

export function SyncStatus({ status }: SyncStatusProps) {
  const content = statusContent[status];
  const Icon = status === "syncing" ? CloudCog : status === "pending" ? CloudUpload : Cloud;

  return (
    <div className="flex items-start gap-3" role="status">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{content.label}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{content.description}</p>
      </div>
    </div>
  );
}
