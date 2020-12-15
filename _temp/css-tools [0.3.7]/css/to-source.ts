
function toSource (css: TemplateStringsArray, values: unknown[])
{
  const result: any[] = [];

  for (let i = 0; i < css.length; i++)
  {
    result.push(css[i]);

    if (i < values.length)
    {
      result.push(values[i]);
    }
  }

  return result.join('');
}

export default toSource;