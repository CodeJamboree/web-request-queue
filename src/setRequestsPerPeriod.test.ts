import { setRequestsPerPeriod } from './setRequestsPerPeriod.js';
import { expect } from '../scripts/utils/expect.js';
import { maxPerPeriod, state } from './state.js';

export const one = () => {
  setRequestsPerPeriod(1);
  expect(state.getNum(maxPerPeriod)).is(1);
}
export const zero = () => {
  const count = state.getNum(maxPerPeriod);
  expect(() => {
    setRequestsPerPeriod(0);
  }).toThrow("WebQueueError: max out of range (0). Must be finite number at 1 or more.");
  expect(state.getNum(maxPerPeriod)).is(count);
}
export const infinite = () => {
  const count = state.getNum(maxPerPeriod);
  expect(() => {
    setRequestsPerPeriod(Infinity);
  }).toThrow("WebQueueError: max out of range (Infinity). Must be finite number at 1 or more.");
  expect(state.getNum(maxPerPeriod)).is(count);
}

export const booleanTrue = () => {
  const count = state.getNum(maxPerPeriod);
  expect(() => {
    // @ts-expect-error
    setRequestsPerPeriod(true);
  }).toThrow("WebQueueError: max out of range (true). Must be finite number at 1 or more.");
  expect(state.getNum(maxPerPeriod)).is(count);
}