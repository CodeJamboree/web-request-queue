import { queue } from './queue.js';
import { setProgressDelay } from './setProgressDelay.js';
import { setThrottleMax } from './setThrottleMax.js';
import { setThrottlePeriod } from './setThrottlePeriod.js';
import { setTotalRequests } from './setTotalRequests.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';

export const webRequest = {
  queue,
  setProgressDelay,
  setThrottleMax,
  setThrottlePeriod,
  setTotalRequests,
  cancelQueuedRequests,
}
