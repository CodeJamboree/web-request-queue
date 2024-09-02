import { startProgressTimer } from './timers/startProgressTimer.js';
import { state } from './state.js';
import { stopProgressTimer } from './timers/stopProgressTimer.js';

export const setEvaluationSeconds = seconds => {
  state.set('progressSeconds', seconds);
  if (state.get('progressIntervalId') || state.get('progressTimeoutId')) {
    stopProgressTimer();
    startProgressTimer();
  }
}
