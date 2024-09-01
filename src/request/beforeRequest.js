import { state } from '../state.js';
import { timeLogger } from '../progress/timeLogger.js';

export const beforeRequest = () => {
  state.setNow('lastRequest');
  if (!state.get('firstRequest')) {
    timeLogger.start();
    state.setNow('firstRequest');
  }
  state.increment('requestCount');
}