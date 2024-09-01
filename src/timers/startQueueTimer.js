import { state } from '../state.js';
import { onNextRequest } from './onNextRequest.js';
import { msPerRequest } from '../request/msPerRequest.js';
import { delayRequest } from '../request/delayRequest.js';

const padMs = 4;
const minMs = 4;

export const startQueueTimer = () => {
  if (
    state.get('pendingIntervalId') ||
    state.get('pendingTimeoutId')
  ) return;

  const delayMs = delayRequest();

  if (!delayMs) {
    startInterval();
    return;
  }

  const ms = Math.max(minMs, delayMs + padMs);
  state.set('pendingTimeoutId', setTimeout(delayedStart, ms));
}

const delayedStart = () => {
  clearTimeout(state.get('pendingTimeoutId'));
  state.remove('pendingTimeoutId');
  startInterval();
}

const startInterval = () => {
  if (state.count('queue') === 0) return;
  const ms = msPerRequest() + padMs;
  state.set('pendingIntervalId', setInterval(onNextRequest, Math.max(minMs, ms)));
  onNextRequest();
}