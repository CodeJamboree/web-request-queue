import { state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerProgress } from './msPerProgress.js';

export const delayProgress = () => {
  const progressedAt = state.get('progressedAt');
  if (!progressedAt) return false;
  let delta = msPerProgress() - timeSince(progressedAt);
  if (delta <= 0) return false;
  return delta;
}
