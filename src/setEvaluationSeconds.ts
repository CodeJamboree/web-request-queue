import { startProgressTimer } from './timers/startProgressTimer.js';
import { evalInterval, evalTimeout, secondsPerEval, state } from './state.js';
import { stopProgressTimer } from './timers/stopProgressTimer.js';

export const setEvaluationSeconds = (seconds: number) => {
  state.setNum(secondsPerEval, seconds);
  if (state.hasTimers(evalInterval, evalTimeout)) {
    stopProgressTimer();
    startProgressTimer();
  }
}
