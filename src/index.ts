import { queue } from './queue';
import { setEvaluationSeconds } from './setEvaluationSeconds';
import { setRequestsPerPeriod } from './setRequestsPerPeriod';
import { setSecondsPerPeriod } from './setSecondsPerPeriod';
import { setTotalRequests } from './setTotalRequests';
import { cancelQueuedRequests } from './request/cancelQueuedRequests';

export const webRequest = {
  queue,
  setEvaluationSeconds,
  setRequestsPerPeriod,
  setSecondsPerPeriod,
  setTotalRequests,
  cancelQueuedRequests,
}
