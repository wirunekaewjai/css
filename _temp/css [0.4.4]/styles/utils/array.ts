export function join (arr: any[], sep: string)
{
  return arr.filter(e => !!e).join(sep).trim();
}