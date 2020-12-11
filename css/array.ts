
export function join (arr: any[], sep: string)
{
  return arr.filter(e => !!e).join(sep).trim();
}

export function defined (arr: any[])
{
  return arr.filter(e => !!e);
}