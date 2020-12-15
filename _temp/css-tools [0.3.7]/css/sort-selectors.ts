
function getIndex (text: string)
{
  if (text.startsWith('@import'))
  {
    return 0;
  }
  else if (text.startsWith(':root'))
  {
    return 1;
  }
  else if (text.startsWith('*'))
  {
    return 2;
  }
  else if (text.startsWith('html'))
  {
    return 3.1;
  }
  else if (text.startsWith('body'))
  {
    return 3.2;
  }
  else if (text.startsWith('#'))
  {
    return 4.1;
  }
  else if (text.startsWith('.'))
  {
    return 4.2;
  }
  else if (text.startsWith('@page'))
  {
    return 5.1;
  }
  else if (text.startsWith('@media'))
  {
    return 5.2;
  }
  else if (text.startsWith('@supports'))
  {
    return 5.3;
  }

  return 3.3;
}

function sortCSSSelectors (selectors: string[])
{
  return selectors.sort((a, b) =>
  {
    const ai = getIndex(a);
    const bi = getIndex(b);

    if (ai === bi)
    {
      return a.localeCompare(b);
    }

    return ai - bi;
  });
}

export default sortCSSSelectors;