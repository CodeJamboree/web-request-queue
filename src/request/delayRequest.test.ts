import { dateUtils } from '@codejamboree/js-test';
import { expect } from '@codejamboree/js-test';
import { state, recentRequest, maxPerPeriod, secondsPerPeriod } from '../state.js';
import { delayRequest } from './delayRequest.js';

export const beforeEach = () => {
  dateUtils.freeze();
}
export const afterEach = () => {
  dateUtils.restore();
}
export const neverRequested = () => {
  state.removeDate(recentRequest);
  expect(delayRequest()).is(false);
}
export const fullDelay = () => {
  state.setNow(recentRequest);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
  expect(delayRequest()).is(1000);
}
export const excessFullDelay = () => {
  const date = new Date();
  date.setTime(date.getTime() + 1);
  state.setDate(recentRequest, date);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
  expect(delayRequest()).is(1000);
}
export const expireNow = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1000);
  state.setDate(recentRequest, date);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
  expect(delayRequest()).is(false);
}

export const wait1ms = () => {
  const date = new Date();
  date.setTime(date.getTime() - 999);
  state.setDate(recentRequest, date);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
  expect(delayRequest()).is(1);
}
export const expire1msPrior = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1001);
  state.setDate(recentRequest, date);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
  expect(delayRequest()).is(false);
}
