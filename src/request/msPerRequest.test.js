import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { msPerRequest } from './msPerRequest.js';

export const msPerRequest10perSecond = () => {
  state.set('throttleCount', 10);
  state.set('throttleSeconds', 1);
  expect(msPerRequest()).is(100)
}

export const msPerRequest1kPerSecond = () => {
  state.set('throttleCount', 1000);
  state.set('throttleSeconds', 1);
  expect(msPerRequest()).is(1)
}

export const msPerRequest1kPerMinute = () => {
  state.set('throttleCount', 1000);
  state.set('throttleSeconds', 60);
  expect(msPerRequest()).is(60)
}