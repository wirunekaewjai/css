
export default function toSlug (raw: string = '')
{
  return raw.replace(/[^A-Za-z0-9]+/g, ' ').trim().replace(/\s+/g, '-');
}