import { state } from '../state.js';

export const stopProgressTimer = () => {
  const progressTimeoutId = state.getTimeout('progressTimeoutId');
  if (progressTimeoutId) {
    clearTimeout(progressTimeoutId);
    state.removeTimeout('progressTimeoutId');
  }
  const progressIntervalId = state.getTimeout('progressIntervalId');
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
    state.removeTimeout('progressIntervalId');
  }
}
