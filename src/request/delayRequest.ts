import { state, recentRequest } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerRequest } from './msPerRequest.js';

export const delayRequest = () => {
  const last = state.getDate(recentRequest);
  if (!last) return false;
  const fullDelay = msPerRequest();
  let delta = fullDelay - timeSince(last);
  if (delta <= 0) return false;
  return Math.min(delta, fullDelay);
}
