import parseCSS from './parse';

function css (css: TemplateStringsArray, ...values: unknown[])
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

  return parseCSS(result.join(''));
}

export default css;