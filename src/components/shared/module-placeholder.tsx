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
            description="Ainda não há informações para exibir nesta área."
            title="Nenhum registro"
          />
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Construction aria-hidden="true" className="size-4" />
            <span>Os dados desta área aparecerão aqui.</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
