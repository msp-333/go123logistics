export const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const publicPath = (p: string) =>
  `${base}${p.startsWith("/") ? p : `/${p}`}`;
