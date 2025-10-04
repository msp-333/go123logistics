import { z } from 'zod';

export const ScacSchema = z.object({
  carrier: z.string(),
  code: z.string().min(2).max(4),
});

export type Scac = z.infer<typeof ScacSchema>;

export async function fetchScac(): Promise<Scac[]> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const res = await fetch(`${base}/data/scac.json`, { cache: 'force-cache' });
  const json = await res.json();
  const arr = z.array(ScacSchema).parse(json);
  return arr;
}
