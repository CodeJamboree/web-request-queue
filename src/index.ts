import { queue } from './queue.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';
import { configure } from './configure.js';
import { info } from './info.js';

export const webRequest = {
  configure,
  queue,
  cancel: cancelQueuedRequests,
  info
}
