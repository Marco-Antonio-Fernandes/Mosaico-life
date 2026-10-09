"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { OfflineIndicator } from "./offline-indicator";
import { getNavigationTitle } from "./navigation";
import { MainNavigation } from "./main-navigation";
import { PostItNotes } from "./post-it-notes";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  const pageTitle = getNavigationTitle(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#conteudo-principal"
      >
        Pular para o conteúdo principal
      </a>

      {isMobileNavOpen ? (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 cursor-default bg-foreground/35 lg:hidden"
          onClick={() => setIsMobileNavOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        aria-label="Menu lateral"
        className={cn(
          "mosaic-sidebar fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[calc(100vw-1rem)] -translate-x-full flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          isMobileNavOpen && "translate-x-0",
        )}
      >
        <div className="mb-7 flex items-center justify-between px-2">
          <Link
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            href="/"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <span className="block text-base font-bold tracking-tight">Mosaico Life</span>
            <span className="mt-1 block text-xs text-primary">Cuidado conectado</span>
          </Link>
          <button
            aria-label="Fechar menu lateral"
            className="min-h-11 min-w-11 rounded-lg p-2 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 gap-3">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-1">
            <MainNavigation onNavigate={() => setIsMobileNavOpen(false)} />
          </div>
        </div>

        <div className="mt-6 border-t border-sidebar-border pt-4">
          <p className="px-3 text-xs leading-5 text-sidebar-muted">
            Área de trabalho segura para organizar o cuidado.
          </p>
        </div>
      </aside>

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <div className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-2 py-2 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-expanded={isMobileNavOpen}
                aria-label="Abrir menu lateral"
                className="shrink-0 lg:hidden"
                onClick={() => setIsMobileNavOpen(true)}
                size="sm"
                variant="ghost"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Button>
              <div className="min-w-0">
              <p className="flex items-center gap-2 truncate text-sm font-semibold text-foreground">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(66,210,190,0.9)]" />
                {pageTitle}
              </p>
                <p className="hidden text-xs text-muted-foreground sm:block">Protótipo visual · dados fictícios</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <OfflineIndicator />
              <div className="hidden items-center gap-3 border-l border-border pl-3 sm:flex">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
                  DEV
                </span>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-foreground">Modo desenvolvimento</p>
                  <p className="text-xs text-muted-foreground">Login será adicionado depois</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <PostItNotes />
        <main className="min-h-[calc(100vh-4.5rem)] pt-14" id="conteudo-principal">
          <div className="mx-auto w-full min-w-0 max-w-[92rem] px-3 py-5 sm:px-6 sm:py-7 xl:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
