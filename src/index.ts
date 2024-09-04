import { queue } from './queue.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';
import { configure } from './configure.js';
import { info } from './info.js';
import { queueSync } from './queueSync.js';

export const webRequest = {
  configure,
  queue,
  queueSync,
  cancel: cancelQueuedRequests,
  info
}
