import { state } from './state';
import { startQueueTimer } from './timers/startQueueTimer';
import { stopQueueTimer } from './timers/stopQueueTimer';

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
