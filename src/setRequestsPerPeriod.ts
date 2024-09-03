import { maxPerPeriod, queueInterval, queueTimeout, state } from './state.js';
import { startQueueTimer } from './timers/startQueueTimer.js';
import { stopQueueTimer } from './timers/stopQueueTimer.js';
import { guardOneOrMore } from './utils/guardOneOrMore.js';

export const setRequestsPerPeriod = (max: number) => {
  guardOneOrMore(max, 'max');
  state.setNum(maxPerPeriod, max);
  if (state.hasTimers(queueInterval, queueTimeout)) {
    stopQueueTimer();
    startQueueTimer();
  }
}