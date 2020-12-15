
export default function removeComments (css: string)
{
  return removeGroupComments(
    removeInlineComments(css)
  );
}

function removeInlineComments (css: string)
{
  return css.replace(/\/\/.*/g, '');
}

function removeGroupComments (css: string)
{
  const tokens: string[] = [];
  const indices = collectGroupComments(css);

  let startAt = 0;

  for (const [endAt, next] of indices)
  {
    if (startAt !== endAt)
    {
      tokens.push(css.slice(startAt, endAt));
    }

    startAt = next;
  }

  if (startAt + 1 < css.length)
  {
    tokens.push(css.slice(startAt));
  }

  return tokens.join('');
}

function collectGroupComments (src: string)
{
  const indices: Array<[number, number]> = [];

  src.replace(/\/\*/g, (_, i) =>
  {
    const close = findCommentCloseIndex(src, i);

    indices.push([i, close]);

    return _;
  });

  return indices;
}

function findCommentCloseIndex (src: string, startAt: number)
{
  let token = '';
  let i = startAt;

  while (i < src.length)
  {
    token += src[i++];

    if (token.endsWith('*/'))
    {
      return i;
    }
  }

  return i;
}