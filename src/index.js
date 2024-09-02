import { queue } from './queue.js';
import { setProgressDelay } from './setProgressDelay.js';
import { setRequestsPerPeriod } from './setRequestsPerPeriod.js';
import { setSecondsPerPeriod } from './setSecondsPerPeriod.js';
import { setTotalRequests } from './setTotalRequests.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';

export const webRequest = {
  queue,
  setProgressDelay,
  setRequestsPerPeriod,
  setSecondsPerPeriod,
  setTotalRequests,
  cancelQueuedRequests,
}
