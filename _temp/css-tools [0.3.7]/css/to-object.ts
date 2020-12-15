import { CSSObject } from './types';

function collectQuotes (src: string)
{
  const quotes: Array<[number, number]> = [];
  let curr: number[] = [];

  src.replace(/'.+'|".+"/g, (txt, startAt) =>
  {
    const key = txt.startsWith('"') ? '"' : "'";

    for (let i = 0; i < txt.length; i++)
    {
      const c = txt[i];

      if (c === key)
      {
        if (i === 0 || txt[i - 1] !== '\\')
        {
          curr.push(startAt + i);

          if (curr.length === 2)
          {
            quotes.push([curr[0], curr[1]]);
            curr = [];
          }
        }
      }
    }

    // quotes.push([i, i + c.length - 1]);
    return txt;
  });

  return quotes;
}

function parse (css: string)
{
  function isQuote (quotes: Array<[number, number]>, i: number)
  {
    for (const [min, max] of quotes)
    {
      if (i > min && i < max)
      {
        return true;
      }
    }

    return false;
  }

  function getQuote (quotes: Array<[number, number]>, i: number)
  {
    for (const [min, max] of quotes)
    {
      if (i > min && i < max)
      {
        return css[min];
      }
    }

    return undefined;
  }

  function readProperties (text: string, parent: CSSObject)
  {
    const quotes = collectQuotes(text);
    const tokens: string[] = [];

    let offset = 0;

    text.replace(/;/g, (c, i) =>
    {
      if (!isQuote(quotes, i))
      {
        const token = text.slice(offset, i);

        tokens.push(token);
        offset = i + 1;
      }

      return c;
    });

    if (offset < text.length)
    {
      tokens.push(text.slice(offset));
    }

    for (const token of new Set(tokens))
    {
      const [k, ...vs] = token.split(':');  
      parent[k.trim()] = vs.join('').trim();
    }
  }

  function readNames (text: string)
  {
    const quotes = collectQuotes(text);
    const tokens: string[] = [];

    let offset = 0;

    text.replace(/,/g, (c, i) =>
    {
      if (!isQuote(quotes, i))
      {
        const token = text.slice(offset, i).trim();

        tokens.push(token);
        offset = i + 1;
      }

      return c;
    });
    
    if (offset < text.length)
    {
      tokens.push(text.slice(offset).trim());
    }

    return Array.from(new Set(tokens));
  }

  function readSelectors (text: string)
  {
    const quotes = collectQuotes(text);

    function readCommentEnd (startAt: number)
    {
      let token = '';
      let i = startAt;

      while (i < text.length)
      {
        token += text[i++];

        if (token.endsWith('*/'))
        {
          return i;
        }
      }

      return i;
    }

    function readSelector (parent: CSSObject, startAt: number)
    {
      let token = '';
      let i = startAt;

      while (i < text.length)
      {
        if (token.endsWith('/*'))
        {
          token = token.slice(0, -2);
          i = readCommentEnd(i);
        }

        const c = text[i];

        if (c === '{' && !isQuote(quotes, i))
        {
          const selector = token.trim();
          const names = readNames(selector);

          token = '';

          let next = i;

          for (const name of names)
          {
            if (!parent[name])
            {
              parent[name] = {};
            }

            next = readSelector(parent[name] as CSSObject, i + 1);
          }
          
          i = next;
        }
        else if (c === '}' && !isQuote(quotes, i))
        {
          readProperties(token.trim(), parent);
          token = '';

          return i + 1;
        }
        else
        {
          // const q = getQuote(quotes, i);

          // if (q && q === c)
          // {
          //   token += '\\';
          // }

          token += c;
          i++;
        }
      }

      return i;
    }

    let obj: CSSObject = {};
    let i = 0;

    while (i < text.length)
    {
      i = readSelector(obj, i);
    }

    return obj;
  }

  return readSelectors(css);
}

export default parse;