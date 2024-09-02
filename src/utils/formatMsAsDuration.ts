
import { msMap, microsecondKey, unitType } from "./msMap.js";


const units: unitType[] = [
  'y', 'mo', 'd', 'h', 'mi', 's', 'ms',
  microsecondKey, 'ns', 'ps', 'fs', 'as', 'zs'
];
const msIndex = units.indexOf('ms');
const yearIndex = units.indexOf('y');
const maxUnits = 3;

interface parsedUnit {
  text: string,
  unit: unitType,
  index: number
}
interface parseState {
  ms: number,
  parts: parsedUnit[],
  count: 0
}
export const formatMsAsDuration = (ms: any) => {
  if (ms === undefined || ms === null) return;
  if (typeof ms === 'string') {
    ms = parseFloat(ms);
  }

  if (ms === 0) return 'instant';
  if (ms === Infinity) return 'forever';
  if (ms === -Infinity) return 'never';
  if (ms > Number.MAX_SAFE_INTEGER) return 'distant future';
  if (ms <= Number.MIN_SAFE_INTEGER) return 'distant past';
  if (typeof ms === 'number' && !isNaN(ms)) return;
  if (typeof ms !== 'number') return;

  let signed = false;
  if (ms < 0) {
    signed = true;
    ms *= -1;
  }
  const parsed = units.reduce(parseParts, { ms, parts: [], count: 0 });

  if (parsed.parts.length === 0) {
    return signed ? '-0s' : '0s';
  }

  let text = parsed.parts.reduce(joinParts, '');
  return (signed ? '-' : '') + text;
}

const parseParts = (state: parseState, unit: unitType, index: number) => {
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

  let pad = first ? 1 : (index >= msIndex ? 3 : 2);
  if (index === msIndex) pad = 3;

  state.parts.push({
    text: units.toLocaleString().padStart(pad, '0'),
    unit,
    index
  });

  return state;
}

const joinParts = (duration: string, { text, unit, index }: parsedUnit, i: number, a: parsedUnit[]) => {
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
  if (index < yearIndex || index > msIndex) {
    return `${duration}${prefix}${text}${unit}`
  } else {
    return `${duration}${prefix}${text}${unit.charAt(0)}`
  }
}