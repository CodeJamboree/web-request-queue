import { queue } from './queue.js';
import { cancelQueuedRequests } from './request/cancelQueuedRequests.js';
import { configure } from './configure.js';
import { info } from './info.js';
import { queueWithCallbacks } from './queueWithCallbacks.js';
import { toStream } from './toStream.js';
import { asString } from './asString.js';
import { toFile } from './toFile.js';
import { parseJson } from './parseJson.js';
import { parseJsonWithReviver } from './parseJsonWithRevivor.js';

export const webRequest = {
  configure,
  queue,
  queueWithCallbacks,
  toStream,
  asString,
  toFile,
  parseJson,
  parseJsonWithReviver,
  cancel: cancelQueuedRequests,
  info
}
