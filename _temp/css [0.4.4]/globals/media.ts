
type MinMax = {
  type?: 'all' | 'screen' | 'print' | 'speech';
  // min: number | string;
  // max: number | string;
}

type Media = {
  type?: 'all' | 'screen' | 'print' | 'speech';
  features: string[] | string[][];
}

type Value = string | MinMax;

function create_media ()
{
  const enums = {

  };
}

export const media = create_media();