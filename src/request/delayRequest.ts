import { state } from '../state';
import { timeSince } from '../utils/timeSince';
import { msPerRequest } from './msPerRequest';

export const delayRequest = () => {
  const lastAt = state.getDate('lastAt');
  if (!lastAt) return false;
  const fullDelay = msPerRequest();
  let delta = fullDelay - timeSince(lastAt);
  if (delta <= 0) return false;
  return Math.min(delta, fullDelay);
}
