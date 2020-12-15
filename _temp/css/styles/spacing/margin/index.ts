import { Property } from '../../../types/style';
import size from '../../utils/size';

function create (k: string, ns: string[], v: string)
{
  return {
    selector: [[k, v].join('-')],
    props: ns.map(n => `${n}: ${v}`),
  } as Property;
}

export default {
  size: size(['margin'], ['margin']),
  auto: create('margin', ['margin'], 'auto'),

  x: {
    size: size(['margin-x'], ['margin-left', 'margin-right']),
    auto: create('margin-x', ['margin-left', 'margin-right'], 'auto'),
  },

  y: {
    size: size(['margin-y'], ['margin-top', 'margin-bottom']),
    auto: create('margin-y', ['margin-top', 'margin-bottom'], 'auto'),
  },

  top: {
    size: size(['margin-top'], ['margin-top']),
    auto: create('margin-top', ['margin-top'], 'auto'),
  },

  right: {
    size: size(['margin-right'], ['margin-right']),
    auto: create('margin-right', ['margin-right'], 'auto'),
  },

  bottom: {
    size: size(['margin-bottom'], ['margin-bottom']),
    auto: create('margin-bottom', ['margin-bottom'], 'auto'),
  },

  left: {
    size: size(['margin-left'], ['margin-left']),
    auto: create('margin-left', ['margin-left'], 'auto'),
  },
};