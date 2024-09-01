import { setThrottleMax } from './setThrottleMax.js';
import { expect } from '../scripts/utils/expect.js';
import { state } from './state.js';

const stateKey = 'throttleCount';

export const setThrottleMax1 = () => {
  setThrottleMax(1);
  expect(state.get(stateKey)).is(1);
}
export const setThrottleMax0 = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottleMax(0);
  }).toThrow("Max requests per period must be 1 or more. Got 0.");
  expect(state.get(stateKey)).is(count);
}
export const setThrottleMaxInfinity = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottleMax(Infinity);
  }).toThrow("Max requests per period must be 1 or more. Got Infinity.");
  expect(state.get(stateKey)).is(count);
}

export const setThrottleMaxTrue = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottleMax(true);
  }).toThrow("Max requests per period must be 1 or more. Got true.");
  expect(state.get(stateKey)).is(count);
}