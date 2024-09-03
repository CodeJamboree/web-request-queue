import { cancelingQueued, cancelQueueReason } from '../locale.js';
import { state, blocked, queue } from '../state.js';
import { stopTimers } from '../timers/stopTimers.js';
import { queueParams } from '../types.js';
import { invoke } from '../utils/invoke.js';

export const cancelQueuedRequests = (reason: any = cancelQueueReason()) => {
  state.flag(blocked);
  stopTimers();
  if (state.empty(queue)) return;

  const copy = state.removeAll(queue) as queueParams[];

  console.info(cancelingQueued(copy.length));
  copy.forEach(({ onCancel }) => {
    invoke(onCancel, reason);
  });
}
