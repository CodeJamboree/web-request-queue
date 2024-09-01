import { stopPendingRequests } from './cancelQueuedRequests.js';

export const handleResponseError = (_response, onCancel) => error => {
  try {
    if (typeof onCancel === 'function') {
      return onCancel(error);
    } else {
      throw error;
    }
  } catch (e) {
    stopPendingRequests(`A prior request had an error: ${error}`);
    throw e;
  }
}