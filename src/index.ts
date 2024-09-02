import { queue } from './queue.js';
import { setEvaluationSeconds } from './setEvaluationSeconds.js';
import { setRequestsPerPeriod } from './setRequestsPerPeriod.js';
import { setSecondsPerPeriod } from './setSecondsPerPeriod.js';
import { setTotalRequests } from './setTotalRequests.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';

export const webRequest = {
  queue,
  setEvaluationSeconds,
  setRequestsPerPeriod,
  setSecondsPerPeriod,
  setTotalRequests,
  cancelQueuedRequests,
}
