import { state } from '../state.js';
import { onNextRequest } from './onNextRequest.js';
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
  clearTimeout(state.get('queueTimeoutId'));
  state.remove('queueTimeoutId');
  startInterval();
}

const startInterval = () => {
  if (state.count('queue') === 0) return;
  state.set('queueIntervalId', setInterval(
    onNextRequest,
    adjustTimeout(msPerRequest())
  ));
  onNextRequest();
}