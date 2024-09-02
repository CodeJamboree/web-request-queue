import { state } from '../state.js';

export const stopQueueTimer = () => {
  const queueTimeoutId = state.getTimeout('queueTimeoutId');
  if (queueTimeoutId) {
    clearTimeout(queueTimeoutId);
    state.removeTimeout('queueTimeoutId');
  }
  const queueIntervalId = state.getTimeout('queueIntervalId');
  if (queueIntervalId) {
    clearInterval(queueIntervalId);
    state.removeTimeout('queueIntervalId');
  }
}
