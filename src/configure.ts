
import {
  firstRequest,
  state,
  blocked,
  maxPerPeriod,
  secondsPerPeriod
} from './state.js';
import { guardOneOrMore } from './utils/guardOneOrMore.js';
import { stopTimers } from './timers/stopTimers.js';
import { startTimers } from './timers/startTimers.js';

type config = Partial<{
  requestsPerPeriod: number,
  secondsPerPeriod: number,
  pause: boolean
}>;

export const configure = ({
  requestsPerPeriod: max,
  secondsPerPeriod: seconds,
  pause
}: config = {}) => {

  if (max) {
    guardOneOrMore(max, 'requestsPerPeriod');
    state.setNum(maxPerPeriod, max);
  }
  if (seconds) {
    guardOneOrMore(seconds, 'secondsPerPeriod');
    state.setNum(secondsPerPeriod, seconds);
  }

  const isBlocked = state.flagged(blocked);
  if (pause !== undefined) {
    if (!pause && isBlocked) {
      state.flag(blocked, pause);
      startTimers();
    } else if (pause && !isBlocked) {
      stopTimers();
      state.removeDate(firstRequest);
      state.flag(blocked);
    }
  }
}