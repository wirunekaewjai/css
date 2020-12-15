import { join } from './array';

export function url (url: string)
{
  return `url("${url}")`;
}

export function urls (urls: string[])
{
  return join(urls.map(e => url(e)), ', ');
}