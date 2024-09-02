import { stopQueueTimer } from './stopQueueTimer.js';
import { stopProgressTimer } from './stopProgressTimer.js';

export const stopTimers = () => {
  stopQueueTimer();
  stopProgressTimer();
}
