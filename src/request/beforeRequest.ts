import { state } from '../state.js';
import { timeLogger } from '../progress/timeLogger.js';

export const beforeRequest = () => {
  state.setNow('lastAt');
  if (!state.getDate('firstAt')) {
    timeLogger.start();
    state.setNow('firstAt');
  }
  state.increment('requestCount');
}