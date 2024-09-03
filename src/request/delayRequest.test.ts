import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { delayRequest } from './delayRequest.js';

export const neverRequested = () => {
  state.removeDate('lastAt');
  expect(delayRequest()).is(false);
}
export const fullDelay = () => {
  state.setNow('lastAt');
  state.setNum('throttleSeconds', 1);
  state.setNum('throttleCount', 1);
  expect(delayRequest()).is(1000);
}
export const excessFullDelay = () => {
  const date = new Date();
  date.setTime(date.getTime() + 1);
  state.setDate('lastAt', date);
  state.setNum('throttleSeconds', 1);
  state.setNum('throttleCount', 1);
  expect(delayRequest()).is(1000);
}
export const expireNow = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1000);
  state.setDate('lastAt', date);
  state.setNum('throttleSeconds', 1);
  state.setNum('throttleCount', 1);
  expect(delayRequest()).is(false);
}

export const wait1ms = () => {
  const date = new Date();
  date.setTime(date.getTime() - 999);
  state.setDate('lastAt', date);
  state.setNum('throttleSeconds', 1);
  state.setNum('throttleCount', 1);
  expect(delayRequest()).is(1);
}
export const expire1msPrior = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1001);
  state.setDate('lastAt', date);
  state.setNum('throttleSeconds', 1);
  state.setNum('throttleCount', 1);
  expect(delayRequest()).is(false);
}
