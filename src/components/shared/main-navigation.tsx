"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { navigationSections } from "./navigation";

type MainNavigationProps = {
  onNavigate?: () => void;
};

export function MainNavigation({ onNavigate }: MainNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="space-y-6">
      {navigationSections.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-sidebar-muted">
            {section.label}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "mosaic-menu-item flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                    )}
                    href={item.href}
                    onClick={onNavigate}
                  >
                    <Icon aria-hidden="true" className="size-[1.125rem] shrink-0" strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
