import { state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerProgress } from './msPerProgress.js';

export const delayProgress = () => {
  const lastProgress = state.get('lastProgress');
  if (!lastProgress) return false;
  let delta = msPerProgress() - timeSince(lastProgress);
  if (delta <= 0) return false;
  return delta;
}
