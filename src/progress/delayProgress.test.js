import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { delayProgress } from './delayProgress.js';

export const name = 'delayProgress';

export const delayProgressFullDelay = () => {
  state.set('progressSeconds', 10);
  state.set('progressedAt', new Date());
  expect(delayProgress()).is(10000);
}
export const delayProgressOneMs = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.set('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - (ms - 1));
  state.set('progressedAt', date);
  expect(delayProgress()).is(1);
}
export const delayProgressExpireNow = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.set('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - ms);
  state.set('progressedAt', date);
  expect(delayProgress()).is(false);
}
export const delayProgressExpire1ms = () => {
  const seconds = 10;
  const ms = seconds * 1000;
  state.set('progressSeconds', seconds);
  const date = new Date();
  date.setTime(date.getTime() - (ms + 1));
  state.set('progressedAt', date);
  expect(delayProgress()).is(false);
}
