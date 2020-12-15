import { hexToValue, rgbToValue } from '../utils/color';
import { Opacity } from '../../types/color';
import { Property } from '../../types/style';

interface Value {
  name: string;
  value: string;
}

function createResult (direction: string, from: Value, to: Value)
{
  const k = direction.replace(/\s/g, '-');

  return {
    selector: [`bg-linear-gradient-${k}-${from.name}-to-${to.name}`],
    props: [
      `background-image: linear-gradient(${direction}, ${from.value}, ${to.value});`
    ],
  } as Property;
}

function createTo (direction: string, from: Value)
{
  const to = (hex: string, opacity: Opacity = 100) => {
    return createResult(direction, from, {
      name: `hex-${hex}-${opacity}`,
      value: hexToValue(hex, opacity),
    });
  };
  
  to.transparent = createResult(direction, from, {
    name: 'transparent',
    value: 'transparent',
  });
  
  to.current = createResult(direction, from, {
    name: 'current',
    value: 'currentColor',
  });
  
  to.black = (opacity: Opacity = 100) => {
    return createResult(direction, from, {
      name: `black-${opacity}`,
      value: hexToValue('000000', opacity),
    });
  };
  
  to.white = (opacity: Opacity = 100) => {
    return createResult(direction, from, {
      name: `white-${opacity}`,
      value: hexToValue('ffffff', opacity),
    });
  };
  
  to.hex = (hex: string, opacity: Opacity = 100) => {
    return createResult(direction, from, {
      name: `hex-${hex}-${opacity}`,
      value: hexToValue(hex, opacity),
    });
  };
  
  to.rgb = (r: number, g: number, b: number, opacity: Opacity = 100) => {
    return createResult(direction, from, {
      name: `rgb-${r}-${g}-${b}-${opacity}`,
      value: rgbToValue(r, g, b, opacity),
    });
  };

  return { to };
}

function createFrom (direction: string)
{
  const from = (hex: string, opacity: Opacity = 100) => {
    return createTo(direction, {
      name: `hex-${hex}-${opacity}`,
      value: hexToValue(hex, opacity),
    });
  };

  from.transparent = createTo(direction, {
    name: 'transparent',
    value: 'transparent',
  });
  
  from.current = createTo(direction, {
    name: 'current',
    value: 'currentColor',
  });
  
  from.black = (opacity: Opacity = 100) => {
    return createTo(direction, {
      name: `black-${opacity}`,
      value: hexToValue('000000', opacity),
    });
  };
  
  from.white = (opacity: Opacity = 100) => {
    return createTo(direction, {
      name: `white-${opacity}`,
      value: hexToValue('ffffff', opacity),
    });
  };
  
  from.hex = (hex: string, opacity: Opacity = 100) => {
    return createTo(direction, {
      name: `hex-${hex}-${opacity}`,
      value: hexToValue(hex, opacity),
    });
  };
  
  from.rgb = (r: number, g: number, b: number, opacity: Opacity = 100) => {
    return createTo(direction, {
      name: `rgb-${r}-${g}-${b}-${opacity}`,
      value: rgbToValue(r, g, b, opacity),
    });
  };

  return { from };
}

export default {
  to_top_left: createFrom('to top left'),
  to_top: createFrom('to top'),
  to_top_right: createFrom('to top right'),
  to_right: createFrom('to right'),
  to_bottom_right: createFrom('to bottom right'),
  to_bottom: createFrom('to bottom'),
  to_bottom_left: createFrom('to bottom left'),
  to_left: createFrom('to left'),
}