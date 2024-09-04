import { state, queue } from '../state.js';
import { stopTimers } from '../timers/stopTimers.js';
import { invoke } from '../utils/invoke.js';
import { queueParams } from '../global.js';

const cancelKey = 'onCancel';
export const cancelQueuedRequests = (reason?: any) => {
  stopTimers();
  if (state.empty(queue)) return;
  const copy = state.removeAll(queue) as queueParams[];
  for (let i = 0; i < copy.length; i++) {
    const params = copy[i];
    invoke(params[cancelKey], reason);
  }
}
