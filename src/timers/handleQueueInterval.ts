import { state } from '../state.js';
import { stopTimers } from './stopTimers.js';
import { makeRequest } from '../request/makeRequest.js';

export const handleQueueInterval = () => {
  if (state.flagged('isBlocked')) {
    stopTimers();
  }
  const params = state.removeFirst('queue');
  if (params) {
    if (!makeRequest(params)) {
      state.prepend('queue', params);
    }
  }
  if (state.count('queue') === 0) {
    stopTimers();
  }
}