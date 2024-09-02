import { state } from './state.js';
import { startQueueTimer } from './timers/startQueueTimer.js';
import { stopQueueTimer } from './timers/stopQueueTimer.js';

export const setSecondsPerPeriod = (seconds: number) => {
  if (isNaN(seconds) || typeof seconds !== 'number' || !isFinite(seconds) || seconds < 1) {
    throw new Error(`Seconds per throttle period must be 1 or more. Got ${seconds}.`);
  }
  state.setNum('throttleSeconds', seconds);
  if (state.getTimeout('queueIntervalId') || state.getTimeout('queueTimeoutId')) {
    stopQueueTimer();
    startQueueTimer();
  }
}
