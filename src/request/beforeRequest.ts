import { state, recentRequest, firstRequest, requested } from '../state.js';
import { timeLogger } from '../progress/timeLogger.js';

export const beforeRequest = () => {
  state.setNow(recentRequest);
  if (!state.getDate(firstRequest)) {
    timeLogger.start();
    state.setNow(firstRequest);
  }
  state.increment(requested);
}