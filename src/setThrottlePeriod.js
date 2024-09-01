import { state } from './state.js';
import { startQueueTimer } from './timers/startQueueTimer.js';
import { stopQueueTimer } from './timers/stopQueueTimer.js';

export const setThrottlePeriod = seconds => {
  if (isNaN(seconds) || typeof seconds !== 'number' || !isFinite(seconds) || seconds < 1) {
    throw new Error(`Seconds per throttle period must be 1 or more. Got ${seconds}.`);
  }
  state.set('throttleSeconds', seconds);
  if (state.get('pendingIntervalId') || state.get('pendingTimeoutId')) {
    stopQueueTimer();
    startQueueTimer();
  }
}
