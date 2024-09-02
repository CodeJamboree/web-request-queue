import { state } from '../state';
import { timeSince } from '../utils/timeSince';
import { msPerProgress } from './msPerProgress';

export const delayProgress = () => {
  const progressedAt = state.getDate('progressedAt');
  if (!progressedAt) return false;
  let delta = msPerProgress() - timeSince(progressedAt);
  if (delta <= 0) return false;
  return delta;
}
