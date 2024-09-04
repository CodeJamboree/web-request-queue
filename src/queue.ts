import { queueArgs, promisedQueue, requestArgs, ClientRequest, queueParams } from './types.js';
import { state, queue as queueKey } from './state.js';
import { startTimers } from './timers/startTimers.js';
import { WebQueueError } from './WebQueueError.js';
import { outOfRange } from './locale.js';
import { isObject } from './utils/isObject.js';

export const queue = (...args: queueArgs) => {
  const params = parseParams(args);
  state.append(queueKey, params);
  startTimers();
  return params.promise;
}

const parseParams = (args: queueArgs): promisedQueue => {
  const key = 'args';
  const count = args.length;
  const [first] = args;

  switch (count) {
    case 1:
      if (isObject(first) && key in first) {
        return first as queueParams;
      }
    case 2:
    case 3:
      return promisify(args as requestArgs);
    default:
      throw new WebQueueError(outOfRange(key, count, 1, 3));
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
