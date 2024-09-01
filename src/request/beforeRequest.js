import { state } from '../state.js';
import { timeLogger } from '../progress/timeLogger.js';

export const beforeRequest = () => {
  state.set('lastAt', new Date());
  if (!state.get('firstAt')) {
    timeLogger.start();
    state.set('firstAt', new Date());
  }
  state.set('requestCount', state.get('requestCount') + 1);
}