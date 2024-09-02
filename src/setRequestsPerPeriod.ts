import { state } from './state';
import { startQueueTimer } from './timers/startQueueTimer';
import { stopQueueTimer } from './timers/stopQueueTimer';

export const setRequestsPerPeriod = (max: number) => {
  if (isNaN(max) || typeof max !== 'number' || !isFinite(max) || max < 1) {
    throw new Error(`Max requests per period must be 1 or more. Got ${max}.`);
  }
  state.setNum('throttleCount', max);
  if (state.getTimeout('queueIntervalId') || state.getTimeout('queueTimeoutId')) {
    stopQueueTimer();
    startQueueTimer();
  }
}