import { state } from '../state.js';
import { stopTimers } from '../timers/stopTimers.js';

export const cancelQueuedRequests = (reason = `All queued requests canceled.`) => {
  state.set('allowNewRequests', false);
  stopTimers();
  if (state.count('queue') === 0) return;

  const copy = state.copyAll('queue');
  state.removeAll('queue');

  console.info(`Canceling ${copy.length} queued requests`);
  copy.forEach(({ onCancel }) => {
    if (typeof onCancel === 'function') {
      onCancel(reason);
    }
  });
}
