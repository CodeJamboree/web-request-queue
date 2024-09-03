import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { delayProgress } from './delayProgress.js';

export const fullDelay = () => {
  state.setNum('progressSeconds', 10);
  state.setNow('progressedAt');
  expect(delayProgress()).is(10000);
}
export const oneMs = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.setNum('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - (ms - 1));
  state.setDate('progressedAt', date);
  expect(delayProgress()).is(1);
}
export const expireNow = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.setNum('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - ms);
  state.setDate('progressedAt', date);
  expect(delayProgress()).is(false);
}
export const expire1ms = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.setNum('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - (ms + 1));
  state.setDate('progressedAt', date);
  expect(delayProgress()).is(false);
}
