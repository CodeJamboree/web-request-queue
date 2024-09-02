import { startProgressTimer } from './timers/startProgressTimer';
import { state } from './state.js';
import { stopProgressTimer } from './timers/stopProgressTimer';

export const setEvaluationSeconds = (seconds: number) => {
  state.setNum('progressSeconds', seconds);
  if (state.getTimeout('progressIntervalId') || state.getTimeout('progressTimeoutId')) {
    stopProgressTimer();
    startProgressTimer();
  }
}
