import { startQueueTimer } from './startQueueTimer.js';
import { startProgressTimer } from './startProgressTimer.js';

export const startTimers = () => {
  startProgressTimer();
  startQueueTimer();
}
