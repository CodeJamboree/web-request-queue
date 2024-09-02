import { showProgress } from "../progress/showProgress.js";
import { stopProgressTimer } from "./stopProgressTimer.js";
import { delayProgress } from '../progress/delayProgress.js';
import { state } from '../state.js';

export const handleProgressInterval = () => {
  if (state.get('progressSeconds') === Infinity) {
    stopProgressTimer();
    return;
  }

  const firstAt = state.get('firstAt');
  if (!firstAt) return;
  const delayMs = delayProgress();
  if (delayMs) return;

  showProgress();
}