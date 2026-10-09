import { Construction } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ModulePlaceholder({ eyebrow, title, description }: ModulePlaceholderProps) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: title }]}
        description={description}
        eyebrow={eyebrow}
        title={title}
      />
      <Card>
        <CardContent className="p-6 sm:p-8">
          <EmptyState
            description="A estrutura desta área já está pronta para receber a próxima entrega, sem dados de exemplo."
            title="Área em construção"
          />
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Construction aria-hidden="true" className="size-4" />
            <span>Os dados aparecerão aqui quando o módulo for implementado.</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
