
import { msMap } from "./msMap.js";

const units = ['y', 'mo', 'd', 'h', 'mi', 's', 'ms'];
const maxUnits = 3;
const delimiter = ':';

export const formatMsAsDuration = ms => {
  if (ms === undefined || ms === null) return;
  if (typeof ms === 'string' && !isNaN(ms)) {
    ms = parseInt(ms, 10);
  }
  if (ms === 0) return 'instant';
  if (ms === Infinity) return 'forever';
  if (ms === -Infinity) return 'never';
  if (typeof ms !== 'number') return;

  let text = '';
  if (ms < 0) {
    text += '-';
    ms *= -1;
  }
  return units.reduce(reducer, { ms, text, count: 0 }).text;
}

const reducer = (state, unit) => {
  if (state.count >= maxUnits) return state;

  let unitMs = msMap[unit];
  const units = Math.floor(state.ms / unitMs);
  state.ms -= units * unitMs;
  let first = !state.text.endsWith(delimiter);

  // discard zero values until one of the
  // units has a value - or we are evaluating seconds
  if (units === 0 && first && unit !== 's') return state;

  state.count++;

  // if prefixed with delimiter
  // make sure to pad with two digits
  let pad = first ? 1 : 2;
  let stringNum = units.toString();

  switch (unit) {
    case 'ms':
      if (units > 0) {
        state.text += '.';
        state.text += stringNum.padEnd(3, '0');
      }
      state.text += 's';
      break;
    case 's':
      state.text += stringNum.padStart(pad, '0');
      if (state.count === maxUnits) state.text += unit;
      break;
    default:
      state.text += stringNum.padStart(pad, '0');
      state.text += unit.charAt(0);
      if (state.count < maxUnits)
        state.text += delimiter
  }
  return state;
}