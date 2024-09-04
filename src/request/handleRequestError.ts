import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cancelHandler, ClientRequest } from '../types.js';
import { cascadingCancelation } from '../locale.js';
import { invoke } from '../utils/invoke.js';

export const handleRequestError = (_request: ClientRequest, onCancel: cancelHandler | undefined) => (error: Error) => {
  try {
    invoke(onCancel, error);
  } catch (e) {
    cancelQueuedRequests(cascadingCancelation(error));
    throw e;
  }
}