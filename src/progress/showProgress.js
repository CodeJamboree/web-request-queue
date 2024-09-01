import { state } from '../state.js';
import { formatMsAsDuration } from '../utils/formatMsAsDuration.js';
import { delayProgress } from './delayProgress.js';
import { timeSince } from '../utils/timeSince.js';
import { timeLogger } from './timeLogger.js';

export const showProgress = () => {

  const firstRequest = state.get('firstRequest');
  if (!firstRequest) return;
  const delayMs = delayProgress();
  if (delayMs) return;

  const requestCount = state.get('requestCount');
  const totalExpected = state.get('totalExpected');
  const queueCount = state.count('queue');
  const priorRemainingCount = state.get('priorRemainingCount');
  const priorPresumedTotal = state.get('priorPresumedTotal');

  const remainingCount = totalExpected ?
    Math.max(queueCount, totalExpected - requestCount) :
    queueCount;

  const presumedTotal = remainingCount + requestCount;

  if (priorRemainingCount === remainingCount &&
    priorPresumedTotal === presumedTotal
  ) return;

  state.setNow('lastProgress');
  state.set('priorRemainingCount', remainingCount);
  state.set('priorPresumedTotal', presumedTotal);

  const stats = [requestCount];
  if (requestCount !== presumedTotal) {
    stats.push('of', presumedTotal);
  }
  if (requestCount > 0 && remainingCount > 0) {
    const msElapsed = timeSince(firstRequest);
    if (msElapsed > 0) {
      const msPerReq = msElapsed / requestCount;
      const msRemaining = remainingCount * msPerReq;
      const durationRemaining = formatMsAsDuration(msRemaining);
      stats.push('~', durationRemaining);
    }
  }
  timeLogger.log(...stats);
}