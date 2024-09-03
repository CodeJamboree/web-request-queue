import { state, firstRequest, recentEval, queue, requested as requestedKey, expected as expectedKey, priorRemaining, priorTotal } from '../state.js';
import { formatMsAsDuration } from '../utils/formatMsAsDuration.js';
import { timeSince } from '../utils/timeSince.js';
import { timeLogger } from './timeLogger.js';

export const showProgress = () => {

  const requested = state.getNum(requestedKey);
  const expected = state.getNum(expectedKey);
  const oldRemaining = state.getNum(priorRemaining);
  const oldTotal = state.getNum(priorTotal);
  const queued = state.count(queue);

  const remaining = expected ?
    Math.max(queued, expected - requested) :
    queued;

  const total = remaining + requested;

  if (oldRemaining === remaining &&
    oldTotal === total
  ) return;

  state.setNow(recentEval);
  state.setNum(priorRemaining, remaining);
  state.setNum(priorTotal, total);

  const stats: any[] = [requested];
  if (requested !== total) {
    stats.push('of', total);
  }
  if (requested > 0 && remaining > 0) {
    const firstAt = state.getDate(firstRequest);
    if (firstAt) {
      const msElapsed = timeSince(firstAt);
      if (msElapsed > 0) {
        const msPerReq = msElapsed / requested;
        const msRemaining = remaining * msPerReq;
        const durationRemaining = formatMsAsDuration(msRemaining);
        stats.push('~', durationRemaining);
      }
    }
  }
  timeLogger.log(...stats);
}