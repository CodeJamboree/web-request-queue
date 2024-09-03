import { showProgress } from "../progress/showProgress.js";
import { stopProgressTimer } from "./stopProgressTimer.js";
import { delayProgress } from '../progress/delayProgress.js';
import { state, firstRequest, secondsPerEval } from '../state.js';

export const handleProgressInterval = () => {
  if (state.getNum(secondsPerEval) === Infinity) {
    stopProgressTimer();
    return;
  }

  const first = state.getDate(firstRequest);
  if (!first) return;
  const delayMs = delayProgress();
  if (delayMs) return;

  showProgress();
}