import { startQueueTimer } from './startQueueTimer';
import { startProgressTimer } from './startProgressTimer';

export const startTimers = () => {
  startProgressTimer();
  startQueueTimer();
}
