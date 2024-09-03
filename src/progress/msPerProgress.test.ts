import { expect } from '../../scripts/utils/expect.js';
import { secondsPerEval, state } from '../state.js';
import { msPerProgress } from './msPerProgress.js';

export const oneSecond = () => {
  state.setNum(secondsPerEval, 1);
  expect(msPerProgress()).is(1000)
}

export const oneMinute = () => {
  state.setNum(secondsPerEval, 60);
  expect(msPerProgress()).is(60000)
}

export const halfSecond = () => {
  state.setNum(secondsPerEval, 0.5);
  expect(msPerProgress()).is(500)
}