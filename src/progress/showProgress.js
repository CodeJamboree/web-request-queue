import { state } from '../state.js';
import { formatMsAsDuration } from '../utils/formatMsAsDuration.js';
import { timeSince } from '../utils/timeSince.js';
import { timeLogger } from './timeLogger.js';

export const showProgress = () => {

  const requestCount = state.get('requestCount');
  const expectedCount = state.get('expectedCount');
  const queueCount = state.count('queue');
  const priorRemainingCount = state.get('priorRemainingCount');
  const priorPresumedTotal = state.get('priorPresumedTotal');

  const remainingCount = expectedCount ?
    Math.max(queueCount, expectedCount - requestCount) :
    queueCount;

  const presumedTotal = remainingCount + requestCount;

  if (priorRemainingCount === remainingCount &&
    priorPresumedTotal === presumedTotal
  ) return;

  state.set('progressedAt', new Date());
  state.set('priorRemainingCount', remainingCount);
  state.set('priorPresumedTotal', presumedTotal);

  const stats = [requestCount];
  if (requestCount !== presumedTotal) {
    stats.push('of', presumedTotal);
  }
  if (requestCount > 0 && remainingCount > 0) {
    const firstAt = state.get('firstAt');
    const msElapsed = timeSince(firstAt);
    if (msElapsed > 0) {
      const msPerReq = msElapsed / requestCount;
      const msRemaining = remainingCount * msPerReq;
      const durationRemaining = formatMsAsDuration(msRemaining);
      stats.push('~', durationRemaining);
    }
  }
  timeLogger.log(...stats);
}