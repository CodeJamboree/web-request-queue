import { expect } from '../scripts/utils/expect.js';
import { secondsPerPeriod, state } from './state.js';
import { setSecondsPerPeriod } from './setSecondsPerPeriod.js';

export const oneMs = () => {
  setSecondsPerPeriod(1);
  expect(state.getNum(secondsPerPeriod)).is(1);
}
export const zero = () => {
  const count = state.getNum(secondsPerPeriod);
  expect(() => {
    setSecondsPerPeriod(0);
  }).toThrow("WebQueueError: seconds out of range (0). Must be finite number at 1 or more.");
  expect(state.getNum(secondsPerPeriod)).is(count);
}
export const infinity = () => {
  const count = state.getNum(secondsPerPeriod);
  expect(() => {
    setSecondsPerPeriod(Infinity);
  }).toThrow("WebQueueError: seconds out of range (Infinity). Must be finite number at 1 or more.");
  expect(state.getNum(secondsPerPeriod)).is(count);
}

export const booleanTrue = () => {
  const count = state.getNum(secondsPerPeriod);
  expect(() => {
    // @ts-expect-error
    setSecondsPerPeriod(true);
  }).toThrow("WebQueueError: seconds out of range (true). Must be finite number at 1 or more.");
  expect(state.getNum(secondsPerPeriod)).is(count);
}