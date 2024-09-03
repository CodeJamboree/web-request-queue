import { badStatus, canceledFromOtherRequest, defaultStatusMessage } from '../locale.js';
import { IncomingMessage } from '../types.js';
import { invoke } from '../utils/invoke.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';

export const handleResponseEnd = (response: IncomingMessage, onCancel: Function | undefined) => () => {
  const { statusCode = 200, statusMessage = defaultStatusMessage(response.statusCode) } = response;
  if (statusCode >= 200 && statusCode < 300) return;
  const reason = badStatus(statusCode, statusMessage);
  try {
    invoke(onCancel, reason);
  } finally {
    cancelQueuedRequests(canceledFromOtherRequest(reason));
  }
}