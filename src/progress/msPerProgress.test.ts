import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { msPerProgress } from './msPerProgress.js';

export const oneSecond = () => {
  state.setNum('progressSeconds', 1);
  expect(msPerProgress()).is(1000)
}

export const oneMinute = () => {
  state.setNum('progressSeconds', 60);
  expect(msPerProgress()).is(60000)
}

export const halfSecond = () => {
  state.setNum('progressSeconds', 0.5);
  expect(msPerProgress()).is(500)
}