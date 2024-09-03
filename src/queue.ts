import { queueArgs, promisedQueue, requestArgs, ClientRequest, requestHandler, cancelHandler, queueParams } from './types';
import { state } from './state.js';
import { startTimers } from './timers/startTimers.js';

export const queue = (...args: queueArgs) => {
  if (state.flagged('isBlocked')) {
    throw new Error(`Not allowing new requests.`);
  }

  const params = parseParams(args);

  state.append('queue', params);
  startTimers();

  return params.promise;
}

const parseParams = (args: queueArgs): promisedQueue => {

  const count = args.length;
  const [first] = args;

  switch (count) {
    case 1:
      if (typeof first === 'object' && 'args' in first) {
        return first as queueParams;
      }
    case 2:
    case 3:
      return promisify(args as requestArgs);
    default:
      throw new Error(`Expected 1 - 3 arguments. Got ${count}.`);
  }
}

const promisify = (args: requestArgs) => {
  let onRequested: undefined | ((value: PromiseLike<ClientRequest> | ClientRequest) => void) = undefined;
  let onCancel: undefined | ((reason?: any) => void) = undefined;
  let promise = new Promise<ClientRequest>((resolve, reject) => {
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
