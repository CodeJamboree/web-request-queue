
import { isNumber } from "./isNumber.js";
import { isString } from "./isString.js";
import { msMap, microsecondKey, unitType } from "./msMap.js";
const msUnit = 'ms';
const secondsUnit = 's';
const yearUnit = 'y';

const units: unitType[] = [
  yearUnit, 'mo', 'd', 'h', 'mi', secondsUnit, msUnit,
  microsecondKey, 'ns', 'ps', 'fs', 'as', 'zs'
];
const msIndex = units.indexOf(msUnit);
const yearIndex = units.indexOf(yearUnit);
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
  if (isString(ms)) {
    ms = parseFloat(ms);
  }
  if (!isNumber(ms)) return;
  if (isNaN(ms)) return;
  switch (ms) {
    case 0: return 'instant';
    case Infinity: return 'forever';
    case -Infinity: return 'never';
    default: break;
  }

  if (ms > Number.MAX_SAFE_INTEGER) return 'distant future';
  if (ms <= Number.MIN_SAFE_INTEGER) return 'distant past';

  let sign = '';
  if (ms < 0) {
    sign = '-';
    ms *= -1;
  }
  const parsed = units.reduce(parseParts, { ms, parts: [], count: 0 });

  if (parsed.parts.length === 0) {
    return `${sign}0${secondsUnit}`;
  }

  let text = parsed.parts.reduce(joinParts, '');
  return `${sign}${text}`;
}

const parseParts = (state: parseState, unit: unitType, index: number) => {
  if (state.parts.length >= maxUnits) return state;

  let unitMs = msMap[unit];
  const units = Math.floor(state.ms / unitMs);
  state.ms -= units * unitMs;
  let first = state.parts.length === 0;

  if (units === 0) {
    if (first || state.parts.length >= maxUnits) {
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
  const isMs = unit === msUnit;
  const isLast = i === a.length - 1;
  if (i === 0) {
    if (isMs) {
      prefix = '0.';
    }
  } else {
    prefix = isMs ? '.' : ':';
  }

  let suffix: string = '';
  if (unit === secondsUnit && !isLast) {
  } else if (isMs) {
    suffix = secondsUnit;
  } else if (index < yearIndex || index > msIndex) {
    suffix = unit;
  } else {
    suffix = unit.charAt(0);
  }
  return `${duration}${prefix}${text}${suffix}`;
}