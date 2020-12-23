
function join (arr: any[], sep: string)
{
  return arr.filter(e => !!e).join(sep).trim();
}

function defined (arr: any[])
{
  return arr.filter(e => !!e);
}

function distinct (arr: any[])
{
  return arr.filter((e, i, a) => a.indexOf(e) === i);
}

export default {
  join,
  defined,
  distinct,
}