// lib/publicPath.ts
/**
 * Prefix an asset path so it works on localhost and on GitHub Pages.
 * If you also set basePath/assetPrefix in next.config, this still works.
 */
export const publicPath = (path: string): string => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const base =
    process.env.NEXT_PUBLIC_BASE_PATH ||
    (typeof window !== "undefined" &&
      (globalThis as any).__NEXT_DATA__?.assetPrefix) ||
    "";
  return `${base}${clean}`;
};
