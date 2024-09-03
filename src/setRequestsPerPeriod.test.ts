import { setRequestsPerPeriod } from './setRequestsPerPeriod.js';
import { expect } from '../scripts/utils/expect.js';
import { state } from './state.js';

const stateKey = 'throttleCount';

export const one = () => {
  setRequestsPerPeriod(1);
  expect(state.getNum(stateKey)).is(1);
}
export const zero = () => {
  const count = state.getNum(stateKey);
  expect(() => {
    setRequestsPerPeriod(0);
  }).toThrow("Max requests per period must be 1 or more. Got 0.");
  expect(state.getNum(stateKey)).is(count);
}
export const infinite = () => {
  const count = state.getNum(stateKey);
  expect(() => {
    setRequestsPerPeriod(Infinity);
  }).toThrow("Max requests per period must be 1 or more. Got Infinity.");
  expect(state.getNum(stateKey)).is(count);
}

export const booleanTrue = () => {
  const count = state.getNum(stateKey);
  expect(() => {
    // @ts-expect-error
    setRequestsPerPeriod(true);
  }).toThrow("Max requests per period must be 1 or more. Got true.");
  expect(state.getNum(stateKey)).is(count);
}