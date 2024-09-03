import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { msPerRequest } from './msPerRequest.js';

export const tenPerSecond = () => {
  state.setNum('throttleCount', 10);
  state.setNum('throttleSeconds', 1);
  expect(msPerRequest()).is(100)
}

export const oneThousandPerSecond = () => {
  state.setNum('throttleCount', 1000);
  state.setNum('throttleSeconds', 1);
  expect(msPerRequest()).is(1)
}

export const oneThousandPerMinute = () => {
  state.setNum('throttleCount', 1000);
  state.setNum('throttleSeconds', 60);
  expect(msPerRequest()).is(60)
}