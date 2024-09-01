import { state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerRequest } from './msPerRequest.js';

export const delayRequest = () => {
  if (!state.get('lastRequest')) return false;
  let delta = msPerRequest() - timeSince(state.get('lastRequest'));
  if (delta <= 0) return false;
  return delta;
}
