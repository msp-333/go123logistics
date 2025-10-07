// Return a correct URL on localhost and on GH Pages (/go123logistics/*)
const PROD_BASE = "/go123logistics";

export function publicPath(p: string): string {
  const clean = p.startsWith("/") ? p : `/${p}`;
  if (typeof window !== "undefined") {
    // if running in the browser, try to derive the base from the URL
    const seg1 = window.location.pathname.split("/")[1] || "";
    const base = seg1 ? `/${seg1}` : "";
    return `${base}${clean}`;
  }
  // build-time: use PROD_BASE in production, empty in dev
  return process.env.NODE_ENV === "production" ? `${PROD_BASE}${clean}` : clean;
}
