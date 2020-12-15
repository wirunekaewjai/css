export type Unit = 
'px' | 'mm' | 'cm' | 'in' | 'pc' | 'pt' |
'em' | 'rem' | 'vw' | 'vh' | 'vmin' | 'vmax';

export type Length = `${number}${Unit}`;