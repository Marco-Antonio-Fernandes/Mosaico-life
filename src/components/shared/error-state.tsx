import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Não foi possível carregar esta área",
  description = "Tente novamente em instantes. Se o problema continuar, procure o suporte.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6" role="alert">
      <div className="flex items-start gap-4">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          {onRetry ? (
            <Button className="mt-4" onClick={onRetry} size="sm" variant="secondary">
              Tentar novamente
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
