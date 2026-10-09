const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL = (
  configuredApiBaseUrl || "https://mosaico.rotatix.com.br"
).replace(/\/$/, "");

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
