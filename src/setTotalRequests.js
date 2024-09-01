import { state } from './state.js';
import { timeLogger } from './progress/timeLogger.js';

export const setTotalRequests = (value = 1) => {
  if (value < 1 || isNaN(value) || !isFinite(value) || typeof value !== 'number') {
    throw new Error(`Total requests out of range (${value}). Must be finite number at 1 or more.`);
  }
  state.remove('firstAt')
  timeLogger.stop();
  state.set('isBlocked', false);
  state.set('expectedCount', value);
}