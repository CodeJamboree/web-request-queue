import { queueInterval, queueTimeout, secondsPerPeriod, state } from './state.js';
import { startQueueTimer } from './timers/startQueueTimer.js';
import { stopQueueTimer } from './timers/stopQueueTimer.js';
import { guardOneOrMore } from './utils/guardOneOrMore.js';

export const setSecondsPerPeriod = (seconds: number) => {
  guardOneOrMore(seconds, 'seconds');
  state.setNum(secondsPerPeriod, seconds);
  if (state.hasTimeouts(queueInterval, queueTimeout)) {
    stopQueueTimer();
    startQueueTimer();
  }
}

