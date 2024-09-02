import { showProgress } from "../progress/showProgress";
import { stopProgressTimer } from "./stopProgressTimer";
import { delayProgress } from '../progress/delayProgress';
import { state } from '../state';

export const handleProgressInterval = () => {
  if (state.getNum('progressSeconds') === Infinity) {
    stopProgressTimer();
    return;
  }

  const firstAt = state.getDate('firstAt');
  if (!firstAt) return;
  const delayMs = delayProgress();
  if (delayMs) return;

  showProgress();
}