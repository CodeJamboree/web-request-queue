import { state } from '../state.js';
import { handleQueueInterval } from './handleQueueInterval.js';
import { msPerRequest } from '../request/msPerRequest.js';
import { delayRequest } from '../request/delayRequest.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startQueueTimer = () => {
  if (
    state.get('queueIntervalId') ||
    state.get('queueTimeoutId')
  ) return;

  const delayMs = delayRequest();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.set('queueTimeoutId', setTimeout(
    delayedStart,
    adjustTimeout(delayMs)
  ));
}

const delayedStart = () => {
  const queueTimeoutId = state.get('queueTimeoutId');
  if (queueTimeoutId) {
    clearTimeout(queueTimeoutId);
    state.remove('queueTimeoutId');
  }
  startInterval();
}

const startInterval = () => {
  const queueCount = state.count('queue');
  if (queueCount === 0) return;
  if (queueCount > 1) {
    state.set('queueIntervalId', setInterval(
      handleQueueInterval,
      adjustTimeout(msPerRequest())
    ));
  }
  handleQueueInterval();
}