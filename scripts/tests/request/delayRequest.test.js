import { expect } from '../../utils/expect.js';
import { state } from '../../../src/state.js';
import { delayRequest } from '../../../src/request/delayRequest.js';

export const name = 'delayRequest';

export const delayRequestNeverRequested = () => {
  state.remove('lastAt');
  expect(delayRequest()).is(false);
}
export const delayRequestRequestedNow = () => {
  state.set('lastAt', new Date());
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(1000);
}
export const delayRequestRequestedExact = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1000);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(false);
}

export const delayRequestRequestedOneMsPrior = () => {
  const date = new Date();
  date.setTime(date.getTime() - 999);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(1);
}
export const delayRequestRequestedOneMsAfter = () => {
  const date = new Date();
  date.setTime(date.getTime() - 1001);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
  expect(delayRequest()).is(false);
}
