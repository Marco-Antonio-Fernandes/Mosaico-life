export function LoadingState({ label = "Carregando conteúdo" }: { label?: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="space-y-4" role="status">
      <span className="sr-only">{label}</span>
      <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
