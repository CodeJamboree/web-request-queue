import { state } from '../state';
import { stopTimers } from './stopTimers';
import { makeRequest } from '../request/makeRequest';

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