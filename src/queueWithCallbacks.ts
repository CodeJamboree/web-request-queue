import { state, queue as queueKey } from './state.js';
import { startTimers } from './timers/startTimers.js';
import { queueParams } from './global.js';

export const queueWithCallbacks = (queue: queueParams) => {
  state.append(queueKey, queue);
  startTimers();
}
