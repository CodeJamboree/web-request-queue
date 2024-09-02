import { state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerRequest } from './msPerRequest.js';

export const delayRequest = () => {
  const lastAt = state.getDate('lastAt');
  if (!lastAt) return false;
  const fullDelay = msPerRequest();
  let delta = fullDelay - timeSince(lastAt);
  if (delta <= 0) return false;
  return Math.min(delta, fullDelay);
}
