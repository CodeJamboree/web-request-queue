
import { msMap } from "./msMap.js";

const units = ['y', 'mo', 'd', 'h', 'mi', 's', 'ms', '\u00B5s', 'ns', 'ps', 'fs', 'as', 'zs'];//, 'ys', 'rs', 'qs', 'p'];
const msIndex = units.indexOf('ms');
const maxUnits = 3;
const delimiter = ':';

export const formatMsAsDuration = ms => {
  if (ms === undefined || ms === null) return;
  if (typeof ms === 'string' && !isNaN(ms)) {
    ms = parseFloat(ms);
  }

  if (ms === 0) return 'instant';
  if (ms === Infinity) return 'forever';
  if (ms === -Infinity) return 'never';
  if (ms > Number.MAX_SAFE_INTEGER) return 'distant future';
  if (ms <= Number.MIN_SAFE_INTEGER) return 'distant past';
  if (typeof ms !== 'number') return;

  let signed = false;
  if (ms < 0) {
    signed = true;
    ms *= -1;
  }
  const parsed = units.reduce(reducer, { ms, parts: [], count: 0 });
  if (parsed.parts.length === 0) {
    return signed ? '-0s' : '0s';
  }
  let text = parsed.parts.reduce((duration, { text, unit, index }, i, a) => {
    let prefix = '';
    if (i === 0) {
      if (unit === 'ms') {
        prefix = '0.';
      }
    } else {
      if (unit === 'ms') {
        prefix = '.'
      } else {
        prefix = ':';
      }
    }

    if (unit === 's' && i !== a.length - 1) {
      return `${duration}${prefix}${text}`;
    }
    if (unit === 'ms') {
      return `${duration}${prefix}${text}s`;
    }
    if (index > msIndex) {
      return `${duration}${prefix}${text}${unit}`
    } else {
      return `${duration}${prefix}${text}${unit.charAt(0)}`
    }
  }, '');
  return (signed ? '-' : '') + text;
}

const reducer = (state, unit, index) => {
  if (state.parts.length >= maxUnits) return state;

  let unitMs = msMap[unit];
  const units = Math.floor(state.ms / unitMs);
  state.ms -= units * unitMs;
  let first = state.parts.length === 0;

  if (units === 0) {
    if (state.parts.length === 0 || state.parts.length >= maxUnits) {
      return state;
    }

    if (index >= msIndex) return state;

  }

  // if prefixed with delimiter
  // make sure to pad with two digits
  let pad = first ? 1 : (index >= msIndex ? 3 : 2);
  if (index === msIndex) pad = 3;

  let stringNum = units.toString();

  state.parts.push({
    text: stringNum.padStart(pad, '0'),
    unit,
    index
  });

  return state;
}