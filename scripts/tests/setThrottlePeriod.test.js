import { expect } from '../utils/expect.js';
import { state } from '../../src/state.js';
import { setThrottlePeriod } from '../../src/setThrottlePeriod.js';

const stateKey = 'throttleSeconds';

export const setThrottlePeriod1 = () => {
  setThrottlePeriod(1);
  expect(state.get(stateKey)).is(1);
}
export const setThrottlePeriod0 = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottlePeriod(0);
  }).toThrow("Seconds per throttle period must be 1 or more. Got 0.");
  expect(state.get(stateKey)).is(count);
}
export const setThrottlePeriodInfinity = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottlePeriod(Infinity);
  }).toThrow("Seconds per throttle period must be 1 or more. Got Infinity.");
  expect(state.get(stateKey)).is(count);
}

export const setThrottlePeriodTrue = () => {
  const count = state.get(stateKey);
  expect(() => {
    setThrottlePeriod(true);
  }).toThrow("Seconds per throttle period must be 1 or more. Got true.");
  expect(state.get(stateKey)).is(count);
}