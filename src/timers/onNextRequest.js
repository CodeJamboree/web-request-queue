import { state } from '../state.js';
import { stopTimers } from './stopTimers.js';
import { makeRequest } from '../request/makeRequest.js';

export const onNextRequest = () => {
  if (state.get('isBlocked')) {
    stopTimers();
    throw new Error(`Not allowing new requests.`);
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