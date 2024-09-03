import { queueInterval, queueTimeout, state } from '../state.js';

export const stopQueueTimer = () => {
  state.clearTimeouts(queueTimeout, queueInterval);
}
