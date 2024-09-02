import { state } from './state.js';
import { startQueueTimer } from './timers/startQueueTimer.js';
import { stopQueueTimer } from './timers/stopQueueTimer.js';

export const setRequestsPerPeriod = max => {
  if (isNaN(max) || typeof max !== 'number' || !isFinite(max) || max < 1) {
    throw new Error(`Max requests per period must be 1 or more. Got ${max}.`);
  }
  state.set('throttleCount', max);
  if (state.get('queueIntervalId') || state.get('queueTimeoutId')) {
    stopQueueTimer();
    startQueueTimer();
  }
}