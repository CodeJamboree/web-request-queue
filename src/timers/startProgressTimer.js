import { state } from '../state.js';
import { showProgress } from '../progress/showProgress.js';
import { delayProgress } from '../progress/delayProgress.js';
import { msPerProgress } from '../progress/msPerProgress.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startProgressTimer = () => {
  if (
    state.get('progressIntervalId') ||
    state.get('progressTimeoutId')
  ) return;

  const delayMs = delayProgress();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.get('progressTimeoutId') = setTimeout(delayedStart, adjustTimeout(delayMs));
}

const delayedStart = () => {
  clearTimeout(state.get('progressTimeoutId'));
  state.remove('progressTimeoutId');
  startInterval();
}

const startInterval = () => {
  if (state.hasNone('queue')) return;
  const ms = msPerProgress();
  state.progressIntervalId = setInterval(showProgress, adjustTimeout(ms));
  showProgress();
}
