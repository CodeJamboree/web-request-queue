import { state } from '../state';

export const stopQueueTimer = () => {
  const queueTimeoutId = state.get('queueTimeoutId');
  if (queueTimeoutId) {
    clearTimeout(queueTimeoutId);
    state.removeTimeout('queueTimeoutId');
  }
  const queueIntervalId = state.get('queueIntervalId');
  if (queueIntervalId) {
    clearInterval(queueIntervalId);
    state.remove('queueIntervalId');
  }
}
