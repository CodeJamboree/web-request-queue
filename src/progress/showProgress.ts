import { state } from '../state';
import { formatMsAsDuration } from '../utils/formatMsAsDuration';
import { timeSince } from '../utils/timeSince';
import { timeLogger } from './timeLogger';

export const showProgress = () => {

  const requestCount = state.getNum('requestCount');
  const expectedCount = state.getNum('expectedCount');
  const queueCount = state.count('queue');
  const priorRemainingCount = state.getNum('priorRemainingCount');
  const priorPresumedTotal = state.getNum('priorPresumedTotal');

  const remainingCount = expectedCount ?
    Math.max(queueCount, expectedCount - requestCount) :
    queueCount;

  const presumedTotal = remainingCount + requestCount;

  if (priorRemainingCount === remainingCount &&
    priorPresumedTotal === presumedTotal
  ) return;

  state.setNow('progressedAt');
  state.setNum('priorRemainingCount', remainingCount);
  state.setNum('priorPresumedTotal', presumedTotal);

  const stats: any[] = [requestCount];
  if (requestCount !== presumedTotal) {
    stats.push('of', presumedTotal);
  }
  if (requestCount > 0 && remainingCount > 0) {
    const firstAt = state.getDate('firstAt');
    if (firstAt) {
      const msElapsed = timeSince(firstAt);
      if (msElapsed > 0) {
        const msPerReq = msElapsed / requestCount;
        const msRemaining = remainingCount * msPerReq;
        const durationRemaining = formatMsAsDuration(msRemaining);
        stats.push('~', durationRemaining);
      }
    }
  }
  timeLogger.log(...stats);
}