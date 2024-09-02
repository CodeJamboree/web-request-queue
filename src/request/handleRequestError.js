import { cancelQueuedRequests } from './cancelQueuedRequests.js';

export const handleRequestError = (_request, onCancel) => error => {
  try {
    if (typeof onCancel === 'function') {
      return onCancel(error);
    } else {
      throw error;
    }
  } catch (e) {
    cancelQueuedRequests(`A prior request had an error: ${error}`);
    throw e;
  }
}