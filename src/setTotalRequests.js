import { state } from './state.js';
import { timeLogger } from './progress/timeLogger.js';

export const setTotalRequests = (value) => {
  state.remove('firstRequest')
  timeLogger.stop();
  state.set('allowNewRequests', true);
  state.set('totalExpected', value);
}