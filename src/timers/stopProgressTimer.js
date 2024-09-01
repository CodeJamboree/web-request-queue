import { state } from '../state.js';

export const stopProgressTimer = () => {
  const progressTimeoutId = state.get('progressTimeoutId');
  if (progressTimeoutId) {
    clearTimeout(progressTimeoutId);
    state.remove('progressTimeoutId');
  }
  const progressIntervalId = state.get('progressIntervalId');
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
    state.remove('progressIntervalId');
  }
}
