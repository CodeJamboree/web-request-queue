import { state } from './state.js';
import { startTimers } from './timers/startTimers.js';

export const queue = (...args) => {
  if (state.get('isBlocked')) {
    throw new Error(`Not allowing new requests.`);
  }

  const params = parseParams(args);

  checkArgs(params.args);

  state.append('queue', params);
  startTimers();
}

const parseParams = (args) => {
  const [first] = args;
  switch (typeof first) {
    case 'string':
      return { args };
    case 'object':
      if (first instanceof URL) return { args };
      if (!('args' in first)) {
        throw new Error(`Missing args key`);
      }
      return first;
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
