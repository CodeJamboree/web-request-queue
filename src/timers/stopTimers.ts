import { stopQueueTimer } from './stopQueueTimer';
import { stopProgressTimer } from './stopProgressTimer';

export const stopTimers = () => {
  stopQueueTimer();
  stopProgressTimer();
}
