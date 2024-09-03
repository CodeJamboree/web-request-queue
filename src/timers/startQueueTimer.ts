import { queue, queueInterval, queueTimeout, state } from '../state.js';
import { handleQueueInterval } from './handleQueueInterval.js';
import { msPerRequest } from '../request/msPerRequest.js';
import { delayRequest } from '../request/delayRequest.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startQueueTimer = () => {
  if (
    state.hasTimeouts(queueInterval, queueTimeout)
  ) return;

  const delayMs = delayRequest();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.setTimeout(
    queueTimeout,
    'timeout',
    delayedStart,
    adjustTimeout(delayMs)
  );
}

const delayedStart = () => {
  state.clearTimeouts(queueTimeout);
  startInterval();
}

const startInterval = () => {
  if (state.empty(queue)) return;
  state.setTimeout(queueInterval, 'interval',
    handleQueueInterval,
    adjustTimeout(msPerRequest())
  );
  handleQueueInterval();
}