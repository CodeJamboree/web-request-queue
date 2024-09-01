import { state } from '../state.js';

export const stopQueueTimer = () => {
  const pendingTimeoutId = state.get('pendingTimeoutId');
  if (pendingTimeoutId) {
    clearTimeout(pendingTimeoutId);
    state.remove('pendingTimeoutId');
  }
  const pendingIntervalId = state.get('pendingIntervalId');
  if (pendingIntervalId) {
    clearInterval(pendingIntervalId);
    state.remove('pendingIntervalId');
  }
}
