import { state } from '../state.js';
import { stopTimers } from '../timers/stopTimers.js';
import { queueParams } from '../types.js';

export const cancelQueuedRequests = (reason: any = `All queued requests canceled.`) => {
  state.flag('isBlocked');
  stopTimers();
  if (state.count('queue') === 0) return;

  const copy = state.removeAll('queue') as queueParams[];

  console.info(`Canceling ${copy.length} queued requests`);
  copy.forEach(({ onCancel }) => {
    if (typeof onCancel === 'function') {
      onCancel(reason);
    }
  });
}
