import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cascadingCancelation } from '../locale.js';
import { invoke } from '../utils/invoke.js';
import { ClientRequest } from '../global.js';

export const handleRequestError = (_request: ClientRequest, onCancel: Function | undefined) => (error: Error) => {
  try {
    invoke(onCancel, error);
  } catch (e) {
    cancelQueuedRequests(cascadingCancelation(error));
    throw e;
  }
}