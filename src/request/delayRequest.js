import { state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerRequest } from './msPerRequest.js';

export const delayRequest = () => {
  if (!state.get('lastAt')) return false;
  const fullDelay = msPerRequest();
  let delta = fullDelay - timeSince(state.get('lastAt'));
  if (delta <= 0) return false;
  return Math.min(delta, fullDelay);
}
