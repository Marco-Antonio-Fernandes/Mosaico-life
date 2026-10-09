import { GitCompareArrows } from "lucide-react";

type ConflictAlertProps = {
  description?: string;
};

export function ConflictAlert({
  description = "Uma alteração precisa ser revisada antes de continuar.",
}: ConflictAlertProps) {
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4" role="alert">
      <div className="flex items-start gap-3">
        <GitCompareArrows aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
        <div>
          <p className="text-sm font-semibold text-foreground">Conflito para revisar</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
