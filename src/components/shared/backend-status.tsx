"use client";

import { Activity, CircleAlert, CircleCheck, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { buildApiUrl } from "@/lib/api-config";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BackendState = "checking" | "online" | "offline" | "degraded";

export function BackendStatus() {
  const [state, setState] = useState<BackendState>("checking");
  const [message, setMessage] = useState("Verificando conexão com o serviço compartilhado.");

  const checkBackend = useCallback(async () => {
    setState("checking");
    setMessage("Verificando conexão com o serviço compartilhado.");

    try {
      const response = await fetch(buildApiUrl("/api/health"), { cache: "no-store" });
      const payload = await response.json();
      const backendStatus = payload?.data?.status;

      if (response.ok && backendStatus === "ok") {
        setState("online");
        setMessage("API e banco SQLite respondendo normalmente.");
        return;
      }

      setState("degraded");
      setMessage("API respondeu, mas o banco precisa de atenção.");
    } catch {
      setState("offline");
      setMessage("Não foi possível alcançar o domínio do backend.");
    }
  }, []);

  useEffect(() => {
    void checkBackend();
  }, [checkBackend]);

  const statusCopy: Record<BackendState, string> = {
    checking: "Verificando",
    online: "Online",
    degraded: "Atenção",
    offline: "Indisponível",
  };

  const StatusIcon = state === "online" ? CircleCheck : state === "offline" ? CircleAlert : Activity;
  const statusColor = state === "online" ? "text-primary" : state === "offline" ? "text-destructive" : "text-warning";

  return (
    <Card className="overflow-hidden border-primary/20 bg-card/90">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <StatusIcon aria-hidden="true" className={`size-5 ${state === "checking" ? "animate-pulse" : ""}`} />
          </span>
          Backend compartilhado
        </CardTitle>
        <span className={`text-xs font-bold uppercase tracking-[0.14em] ${statusColor}`}>{statusCopy[state]}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{message}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <code className="min-w-0 max-w-full break-all rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            {buildApiUrl("/api/health")}
          </code>
          <Button onClick={() => void checkBackend()} size="sm" variant="secondary">
            <RefreshCw aria-hidden="true" className="size-4" />
            Testar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
