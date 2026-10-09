import { LockKeyhole } from "lucide-react";

type PermissionStateProps = {
  title?: string;
  description?: string;
};

export function PermissionState({
  title = "Acesso não disponível",
  description = "Seu perfil não tem permissão para visualizar esta área.",
}: PermissionStateProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-6" role="status">
      <div className="flex items-start gap-4">
        <LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
