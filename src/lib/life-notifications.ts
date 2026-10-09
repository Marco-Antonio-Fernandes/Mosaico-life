export type LifeNotificationKind = "message" | "payment" | "reschedule" | "reminder";

export type LifeNotification = {
  kind: LifeNotificationKind;
  title: string;
  message: string;
};

export function dispatchLifeNotification(notification: LifeNotification) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LifeNotification>("mosaico-life:notification", { detail: notification }));
}
