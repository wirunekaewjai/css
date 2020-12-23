
const sr_only = [
  'position: absolute',
  'width: 1px',
  'height: 1px',
  'padding: 0',
  'margin: -1px',
  'overflow: hidden',
  'clip: rect(0, 0, 0, 0)',
  'white-space: nowrap',
  'border-width: 0',
].join('; ');

const sr_not_only = [
  'position: static',
  'width: auto',
  'height: auto',
  'padding: 0',
  'margin: 0',
  'overflow: visible',
  'clip: auto',
  'white-space: normal',
].join('; ');

export default (only: boolean) => {
  if (only)
  {
    return sr_only;
  }

  return sr_not_only;
}