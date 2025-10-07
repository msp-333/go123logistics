// lib/publicPath.ts
export const publicPath = (path: string): string => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ||
    ((globalThis as any).__NEXT_DATA__?.assetPrefix ?? "");
  return `${base}${clean}`;
};
