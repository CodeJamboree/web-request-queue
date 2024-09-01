import { state } from '../state.js';
import { stopTimers } from './stopTimers.js';
import { makeRequest } from '../request/makeRequest.js';

export const onNextRequest = () => {
  if (!state.get('allowNewRequests')) {
    stopTimers();
    throw new Error(`Not allowing new requests.`);
  }
  const params = state.first('queue');
  if (params) {
    if (!makeRequest(params)) {
      state.prepend('queue', params);
    }
  }
  if (state.hasNone('queue')) {
    stopTimers();
  }
}