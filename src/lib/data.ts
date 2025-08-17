export async function safeFetch<T=any>(path: string): Promise<T|null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// lightweight client calcs (in case insights not precomputed)
export function drawdownFromNav(nav: number[]): number[] {
  let peak = nav[0] ?? 1; return nav.map(v => { peak = Math.max(peak, v); return v/peak - 1; });
}
export function rollingSharpe(ret: number[], win=60): number[] {
  const out:number[] = [];
  for (let i=0;i<ret.length;i++){
    const s = Math.max(0, i - win + 1);
    const slice = ret.slice(s, i+1);
    const mean = slice.reduce((a,b)=>a+b,0)/slice.length;
    const sd = Math.sqrt(slice.reduce((a,b)=>a+(b-mean)**2,0)/(slice.length||1));
    out.push(sd ? (mean/sd)*Math.sqrt(252) : 0);
  }
  return out;
}
