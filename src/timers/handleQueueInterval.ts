import { state, blocked, queue } from '../state.js';
import { stopTimers } from './stopTimers.js';
import { makeRequest } from '../request/makeRequest.js';

export const handleQueueInterval = () => {
  if (state.flagged(blocked)) {
    stopTimers();
    return;
  }
  const params = state.removeFirst(queue);
  if (params) {
    if (!makeRequest(params)) {
      state.prepend(queue, params);
    }
  }
  if (state.empty(queue)) {
    stopTimers();
  }
}