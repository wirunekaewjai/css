
export function join (arr: any[], sep: string)
{
  return arr.filter(e => !!e).join(sep).trim();
}

export function defined (arr: any[])
{
  return arr.filter(e => !!e);
}

export function distinct (arr: any[])
{
  return arr.filter((e, i, a) => a.indexOf(e) === i);
}