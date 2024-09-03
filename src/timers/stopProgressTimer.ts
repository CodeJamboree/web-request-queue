import { evalInterval, evalTimeout, state } from '../state.js';

export const stopProgressTimer = () => {
  state.clearTimers(evalTimeout, evalInterval);
}
