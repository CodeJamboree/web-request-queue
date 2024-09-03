import { recentEval, state } from '../state.js';
import { timeSince } from '../utils/timeSince.js';
import { msPerProgress } from './msPerProgress.js';

export const delayProgress = () => {
  const recent = state.getDate(recentEval);
  if (!recent) return false;
  let delta = msPerProgress() - timeSince(recent);
  if (delta <= 0) return false;
  return delta;
}
