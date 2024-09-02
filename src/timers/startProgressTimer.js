import { state } from '../state.js';
import { handleProgressInterval } from './handleProgressInterval.js';
import { delayProgress } from '../progress/delayProgress.js';
import { msPerProgress } from '../progress/msPerProgress.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startProgressTimer = () => {
  if (state.get('progressSeconds') === Infinity) return;
  if (
    state.get('progressIntervalId') ||
    state.get('progressTimeoutId')
  ) return;

  const delayMs = delayProgress();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.get('progressTimeoutId') = setTimeout(
    delayedStart,
    adjustTimeout(delayMs)
  );
}

const delayedStart = () => {
  clearTimeout(state.get('progressTimeoutId'));
  state.remove('progressTimeoutId');
  startInterval();
}

const startInterval = () => {
  if (state.count('queue') === 0) return;
  state.set('progressIntervalId', setInterval(
    handleProgressInterval,
    adjustTimeout(msPerProgress())
  ));
  handleProgressInterval();
}
