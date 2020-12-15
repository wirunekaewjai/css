import { Property } from '../../types/style';

const keys: any = {};
let i = 1;

function getKey (url: string)
{
  if (!keys[url])
  {
    keys[url] = (i++).toString(36);
  }

  return keys[url];
}

export default {
  none: {
    selector: ['bg-none'],
    props: ['background-image: none'],
  } as Property,

  url: (url: string) => ({
    selector: [`bg-image-url-${getKey(url)}`],
    props: [`background-image: url("${url}")`],
  } as Property),
}