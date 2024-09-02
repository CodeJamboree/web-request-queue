import { cancelQueuedRequests } from './cancelQueuedRequests';
import { cancelHandler, ClientRequest } from '../types';

export const handleRequestError = (_request: ClientRequest, onCancel: cancelHandler | undefined) => (error: Error) => {
  try {
    if (typeof onCancel === 'function') {
      return onCancel(error);
    }
  } catch (e) {
    cancelQueuedRequests(`A prior request had an error: ${error}`);
    throw e;
  }
}