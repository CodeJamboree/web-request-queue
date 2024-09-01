import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { msPerProgress } from './msPerProgress.js';

export const name = 'msPerProgress';

export const msPerProgressOneSecond = () => {
  state.set('progressSeconds', 1);
  expect(msPerProgress()).is(1000)
}

export const msPerProgressOneMinute = () => {
  state.set('progressSeconds', 60);
  expect(msPerProgress()).is(60000)
}

export const msPerProgressHalfSecond = () => {
  state.set('progressSeconds', 0.5);
  expect(msPerProgress()).is(500)
}