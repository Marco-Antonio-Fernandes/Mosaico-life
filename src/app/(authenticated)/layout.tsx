import { AppShell } from "@/components/shared/app-shell";

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
