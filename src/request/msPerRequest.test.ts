import { expect } from '@codejamboree/js-test';
import { maxPerPeriod, secondsPerPeriod, state } from '../state.js';
import { msPerRequest } from './msPerRequest.js';

export const tenPerSecond = () => {
  state.setNum(maxPerPeriod, 10);
  state.setNum(secondsPerPeriod, 1);
  expect(msPerRequest()).is(100)
}

export const oneThousandPerSecond = () => {
  state.setNum(maxPerPeriod, 1000);
  state.setNum(secondsPerPeriod, 1);
  expect(msPerRequest()).is(1)
}

export const oneThousandPerMinute = () => {
  state.setNum(maxPerPeriod, 1000);
  state.setNum(secondsPerPeriod, 60);
  expect(msPerRequest()).is(60)
}