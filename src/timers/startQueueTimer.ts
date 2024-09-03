import { queue, queueInterval, queueTimeout, state } from '../state.js';
import { handleQueueInterval } from './handleQueueInterval.js';
import { msPerRequest } from '../request/msPerRequest.js';
import { delayRequest } from '../request/delayRequest.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startQueueTimer = () => {
  if (
    state.hasTimers(queueInterval, queueTimeout)
  ) return;

  const delayMs = delayRequest();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.startTimeout(
    queueTimeout,
    delayedStart,
    adjustTimeout(delayMs)
  );
}

const delayedStart = () => {
  state.clearTimers(queueTimeout);
  startInterval();
}

const startInterval = () => {
  if (state.empty(queue)) return;
  state.startInterval(queueInterval,
    handleQueueInterval,
    adjustTimeout(msPerRequest())
  );
  handleQueueInterval();
}