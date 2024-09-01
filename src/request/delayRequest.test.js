import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { delayRequest } from './delayRequest.js';

export const neverRequested = () => {
  state.remove('lastAt');
  expect(delayRequest()).is(false);
}
export const fullDelay = () => {
  state.set('lastAt', new Date());
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(1000);
}
export const excessFullDelay = () => {
  const date = new Date();
  date.setTime(date.getTime() + 1);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(1000);
}
export const expireNow = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1000);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(false);
}

export const wait1ms = () => {
  const date = new Date();
  date.setTime(date.getTime() - 999);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(1);
}
export const expire1msPrior = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1001);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(false);
}
