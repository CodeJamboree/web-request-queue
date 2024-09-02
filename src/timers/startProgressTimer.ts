import { state } from '../state';
import { handleProgressInterval } from './handleProgressInterval';
import { delayProgress } from '../progress/delayProgress';
import { msPerProgress } from '../progress/msPerProgress';
import { adjustTimeout } from './adjustTimeout';

export const startProgressTimer = () => {
  if (state.getNum('progressSeconds') === Infinity) return;
  if (
    state.getTimeout('progressIntervalId') ||
    state.getTimeout('progressTimeoutId')
  ) return;

  const delayMs = delayProgress();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.setTimeout('progressTimeoutId', setTimeout(
    delayedStart,
    adjustTimeout(delayMs)
  ));
}

const delayedStart = () => {
  clearTimeout(state.getTimeout('progressTimeoutId'));
  state.removeTimeout('progressTimeoutId');
  startInterval();
}

const startInterval = () => {
  if (state.count('queue') === 0) return;
  state.setTimeout('progressIntervalId', setInterval(
    handleProgressInterval,
    adjustTimeout(msPerProgress())
  ));
  handleProgressInterval();
}
