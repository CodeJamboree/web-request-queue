import { setRequestsPerPeriod } from './setRequestsPerPeriod.js';
import { expect } from '../scripts/utils/expect.js';
import { state } from './state.js';

const stateKey = 'throttleCount';

export const one = () => {
  setRequestsPerPeriod(1);
  expect(state.get(stateKey)).is(1);
}
export const zero = () => {
  const count = state.get(stateKey);
  expect(() => {
    setRequestsPerPeriod(0);
  }).toThrow("Max requests per period must be 1 or more. Got 0.");
  expect(state.get(stateKey)).is(count);
}
export const infinite = () => {
  const count = state.get(stateKey);
  expect(() => {
    setRequestsPerPeriod(Infinity);
  }).toThrow("Max requests per period must be 1 or more. Got Infinity.");
  expect(state.get(stateKey)).is(count);
}

export const booleanTrue = () => {
  const count = state.get(stateKey);
  expect(() => {
    setRequestsPerPeriod(true);
  }).toThrow("Max requests per period must be 1 or more. Got true.");
  expect(state.get(stateKey)).is(count);
}