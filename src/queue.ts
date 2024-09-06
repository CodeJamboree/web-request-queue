import { state, queue as queueKey } from './state.js';
import { startTimers } from './timers/startTimers.js';
import { promisedQueue, requestArgs, cancelCallback, requestCallback } from './global.js';
import * as http from 'http';

export const queue = async (...args: requestArgs): Promise<http.ClientRequest> => {
  const params = await promisify(args);
  state.append(queueKey, params);
  startTimers();
  return params.promise;
}

const promisify = async (args: requestArgs) => {
  let onRequested: undefined | requestCallback = undefined;
  let onCancel: undefined | cancelCallback = undefined;
  let promise = new Promise<http.ClientRequest>((resolve, reject) => {
    onRequested = resolve;
    onCancel = reject;
  });
  const query: promisedQueue = {
    args,
    promise,
    onRequested,
    onCancel
  };
  return query;
}
