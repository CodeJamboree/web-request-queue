import { state } from './state.js';
import { startTimers } from './timers/startTimers.js';

export const queue = (...args) => {
  if (state.get('isBlocked')) {
    throw new Error(`Not allowing new requests.`);
  }

  const { promise, ...params } = parseParams(args);

  checkArgs(params.args);

  state.append('queue', params);
  startTimers();

  return promise;
}

const parseParams = (args) => {
  const [first] = args;

  switch (typeof first) {
    case 'string':
      return argsAsHttpsArgs(args);
    case 'object':
      if (first instanceof URL) {
        return argsAsHttpsArgs(args);
      }
      if (args.length === 1 && 'args' in first) {
        return argsAsQueueParam(first);
      }
      return argsAsHttpsArgs(args);
    default:
      throw new Error(`Unexpected arguments. Need args for https.request, or object as first arg`);
  }
}

const checkArgs = args => {
  if (Array.isArray(args)) return;
  if (args.length > 0) return;
  const unexpected = Array.isArray(args) ? typeof args : args.length;
  throw new Error(`Expected one or more requestArguments. Got ${unexpected}.`);
}

const argsAsHttpsArgs = (args) => {
  let onRequested, onCancel;
  const promise = new Promise((resolve, reject) => {
    onRequested = resolve;
    onCancel = reject;
  });
  return {
    args,
    promise,
    onRequested,
    onCancel
  };
}
const argsAsQueueParam = (params) => {
  const { args, onRequested, onCancel, ...rest } = params;
  const keys = Object.keys(rest);
  keys.forEach(key => {
    console.debug(`Unrecognized key: ${key}`);
  });
  if (!['function', 'undefined'].includes(typeof onRequested)) {
    throw new Error(`Expected onRequested to be function (${typeof onRequested})`);
  }
  if (!['function', 'undefined'].includes(typeof onCancel)) {
    throw new Error(`Expected onCancel to be function (${typeof onCancel})`);
  }
  if (!Array.isArray(args)) {
    throw new Error(`Expected args to be array. (${typeof args})`);
  }
  if (args.length === 0) {
    throw new Error(`Expected one or more args. (0)`);
  }

  return params;
}