import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8 space-y-4", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Caminho da página">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((breadcrumb, index) => (
              <li className="flex items-center gap-1" key={`${breadcrumb.label}-${index}`}>
                {index > 0 ? <ChevronRight aria-hidden="true" className="size-4" /> : null}
                {breadcrumb.href ? (
                  <Link className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={breadcrumb.href}>
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}>{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="max-w-3xl space-y-2">
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description ? <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p> : null}
      </div>
    </header>
  );
}
