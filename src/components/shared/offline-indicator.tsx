"use client";

import { CloudOff } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
};

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOnline) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning-foreground" role="status">
      <CloudOff aria-hidden="true" className="size-4" />
      <span className="hidden sm:inline">Você está offline</span>
      <span className="sm:hidden">Offline</span>
    </div>
  );
}
