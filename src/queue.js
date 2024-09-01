import { state } from './state.js';
import { startTimers } from './timers/startTimers.js';

export const queue = ({ args, onRequested, onCancel }) => {
  if (!state.get('allowNewRequests')) {
    throw new Error(`Not allowing new requests.`);
  }
  if (!Array.isArray(args) || args.length <= 0) {
    const unexpected = Array.isArray(args) ? typeof args : args.length;
    throw new Error(`Expected one or more requestArguments. Got ${unexpected}.`);
  }
  state.add('queue', { args, onRequested, onCancel });
  startTimers();
}
