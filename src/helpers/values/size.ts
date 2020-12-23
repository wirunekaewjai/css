const toREM = 0.25;

export default (value: number) => {
  return (value * toREM) + 'rem';
}