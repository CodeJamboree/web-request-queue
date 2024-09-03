import { secondsPerEval, state } from '../state.js';

export const msPerProgress = () => 1000 * state.getNum(secondsPerEval);
