import { state, firstRequest, queue, requested as requestedKey, blocked } from './state.js';

export const info = () => {
  const requested = state.getNum(requestedKey);
  const queued = state.count(queue);
  const firstAt = state.getDate(firstRequest);
  const paused = state.flagged(blocked)
  return { requested, queued, firstAt, paused };
}