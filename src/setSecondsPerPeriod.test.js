import { expect } from '../scripts/utils/expect.js';
import { state } from './state.js';
import { setSecondsPerPeriod } from './setSecondsPerPeriod.js';

const stateKey = 'throttleSeconds';

export const oneMs = () => {
  setSecondsPerPeriod(1);
  expect(state.get(stateKey)).is(1);
}
export const zero = () => {
  const count = state.get(stateKey);
  expect(() => {
    setSecondsPerPeriod(0);
  }).toThrow("Seconds per throttle period must be 1 or more. Got 0.");
  expect(state.get(stateKey)).is(count);
}
export const infinity = () => {
  const count = state.get(stateKey);
  expect(() => {
    setSecondsPerPeriod(Infinity);
  }).toThrow("Seconds per throttle period must be 1 or more. Got Infinity.");
  expect(state.get(stateKey)).is(count);
}

export const booleanTrue = () => {
  const count = state.get(stateKey);
  expect(() => {
    setSecondsPerPeriod(true);
  }).toThrow("Seconds per throttle period must be 1 or more. Got true.");
  expect(state.get(stateKey)).is(count);
}