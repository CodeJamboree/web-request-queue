export const microsecondKey = '\u00B5s';
export type unitType = 'mil' | 'cen' | 'dec' |
  'y' | 'mo' | 'w' | 'd' |
  'h' | 'mi' | 's' | 'ms' |
  '\u00B5s' | 'ns' | 'ps' |
  'fs' | 'as' | 'zs';

export const msMap: {
  [key in unitType]: number
} = {
  zs: 0.000000000000000001,
  as: 0.000000000000001,
  fs: 0.000000000001,
  ps: 0.000000001,
  ns: 0.000001,
  [microsecondKey]: 0.001,
  ms: 1,
  s: 1000,
  mi: 60000,
  h: 3600000,
  d: 86400000,
  w: 604800000,
  mo: 2629746000,
  y: 31556952000,
  dec: 315569520000,
  cen: 3155695200000,
  mil: 31556952000000
};