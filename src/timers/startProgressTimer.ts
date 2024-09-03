import { evalInterval, evalTimeout, queue, secondsPerEval, state } from '../state.js';
import { handleProgressInterval } from './handleProgressInterval.js';
import { delayProgress } from '../progress/delayProgress.js';
import { msPerProgress } from '../progress/msPerProgress.js';
import { adjustTimeout } from './adjustTimeout.js';

export const startProgressTimer = () => {
  if (state.getNum(secondsPerEval) === Infinity) return;
  if (state.hasTimeouts(evalInterval, evalTimeout)) return;

  const delayMs = delayProgress();

  if (!delayMs) {
    startInterval();
    return;
  }

  state.setTimeout(evalTimeout, 'timeout',
    delay,
    adjustTimeout(delayMs)
  );
}

const delay = () => {
  state.clearTimeouts(evalTimeout);
  startInterval();
}

const startInterval = () => {
  if (state.empty(queue)) return;
  state.setTimeout(evalInterval, 'interval',
    handleProgressInterval,
    adjustTimeout(msPerProgress())
  );
  handleProgressInterval();
}
