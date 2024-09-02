import { state } from '../state.js';
import { handleQueueInterval } from './handleQueueInterval.js';
import { msPerRequest } from '../request/msPerRequest.js';
import { delayRequest } from '../request/delayRequest.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startQueueTimer = () => {
  if (
    state.getTimeout('queueIntervalId') ||
    state.getTimeout('queueTimeoutId')
  ) return;

  const delayMs = delayRequest();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.setTimeout('queueTimeoutId', setTimeout(
    delayedStart,
    adjustTimeout(delayMs)
  ));
}

const delayedStart = () => {
  const queueTimeoutId = state.getTimeout('queueTimeoutId');
  if (queueTimeoutId) {
    clearTimeout(queueTimeoutId);
    state.removeTimeout('queueTimeoutId');
  }
  startInterval();
}

const startInterval = () => {
  const queueCount = state.count('queue');
  if (queueCount === 0) return;
  state.setTimeout('queueIntervalId', setInterval(
    handleQueueInterval,
    adjustTimeout(msPerRequest())
  ));
  handleQueueInterval();
}