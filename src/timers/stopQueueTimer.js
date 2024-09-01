import { state } from '../state.js';

export const stopQueueTimer = () => {
  const queueTimeoutId = state.get('queueTimeoutId');
  if (queueTimeoutId) {
    clearTimeout(queueTimeoutId);
    state.remove('queueTimeoutId');
  }
  const queueIntervalId = state.get('queueIntervalId');
  if (queueIntervalId) {
    clearInterval(queueIntervalId);
    state.remove('queueIntervalId');
  }
}
