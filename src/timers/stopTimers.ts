import { queueInterval, queueTimeout, state } from '../state.js';

export const stopTimers = () => {
  state.clearTimers(queueTimeout, queueInterval);
}
