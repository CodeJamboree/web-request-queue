import { state } from '../state';
import { timeLogger } from '../progress/timeLogger';

export const beforeRequest = () => {
  state.setNow('lastAt');
  if (!state.getDate('firstAt')) {
    timeLogger.start();
    state.setNow('firstAt');
  }
  state.increment('requestCount');
}