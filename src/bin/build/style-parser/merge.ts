
import array from '../../utils/array';
import { Generic, Styles } from '../types';

export default function mergeStyles (entryStyles: Array<Styles>)
{
  function mergeStyle (src: Styles, dst: Styles)
  {
    for (const key in src)
    {
      if (key.startsWith('@supports') || key.startsWith('@media'))
      {
        if (!dst[key])
        {
          dst[key] = {};
        }

        const srcStyles = src[key] as Styles;
        const dstStyles = dst[key] as Styles;

        mergeStyle(srcStyles, dstStyles);
      }
      else if (key.startsWith('@page'))
      {
        if (!dst[key])
        {
          dst[key] = [];
        }

        const srcProps = src[key] as string[];
        const dstProps = dst[key] as string[];

        for (const prop of srcProps)
        {
          dstProps.push(prop);
        }
      }
      else
      {
        if (!dst[key])
        {
          dst[key] = [];
        }

        const srcSelectors = src[key] as string[];
        const dstSelectors = dst[key] as string[];

        for (const selector of srcSelectors)
        {
          dstSelectors.push(selector);
        }
      }
    }
  }

  function mergeTag (src: Styles)
  {
    const merges: Generic<string[]> = {};
    const dst: Styles = {};

    for (const key in src)
    {
      const val = src[key];

      if (key.startsWith('@'))
      {
        if (Array.isArray(val))
        {
          dst[key] = val;
        }
        else
        {
          dst[key] = mergeTag(val);
        }
      }
      else
      {
        const vals = val as string[];

        if (vals.length > 1)
        {
          dst[key] = vals;
        }
        else if (vals.length === 1)
        {
          if (vals[0].startsWith('.'))
          {
            dst[key] = vals;
          }
          else
          {
            if (!merges[vals[0]])
            {
              merges[vals[0]] = [];
            }

            merges[vals[0]].push(key);
          }
        }
      }
    }

    for (const selector in merges)
    {
      const property = array.join(merges[selector], '; ');
      dst[property] = [selector];
    }

    return dst;
  }

  const dst1: Styles = {};

  for (const src of entryStyles)
  {
    mergeStyle(src, dst1);
  }

  return mergeTag(dst1);
}
