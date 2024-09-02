import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cancelHandler, IncomingMessage } from '../types.js';

export const handleResponseError = (_response: IncomingMessage, onCancel: cancelHandler | undefined) => (error?: any) => {
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