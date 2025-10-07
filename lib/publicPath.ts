const PROD_BASE = "/go123logistics";

function runtimeBaseGuess(): string {
  if (typeof window === "undefined") return "";
  // If we're running under /go123logistics/*, use that as base.
  const seg1 = window.location.pathname.split("/")[1] || "";
  return seg1 ? `/${seg1}` : "";
}

const buildBase =
  process.env.NODE_ENV === "production" ? PROD_BASE : "";

export function publicPath(path: string): string {
  const cleaned = path.startsWith("/") ? path : `/${path}`;
  // Prefer build-time base; if empty at runtime, try to guess.
  const base = buildBase || runtimeBaseGuess() || "";
  return `${base}${cleaned}`;
}
