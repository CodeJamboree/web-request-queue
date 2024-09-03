import { firstRequest, state, blocked, expected } from './state.js';
import { timeLogger } from './progress/timeLogger.js';
import { guardOneOrMore } from './utils/guardOneOrMore.js';

export const setTotalRequests = (value = 1) => {
  guardOneOrMore(value, 'value');
  state.removeDate(firstRequest);
  timeLogger.stop();
  state.flag(blocked, false);
  state.setNum(expected, value);
}