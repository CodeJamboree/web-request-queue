import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cancelHandler, IncomingMessage } from '../types.js';
import { otherRequestError } from '../locale.js';
import { invokeOrDefault } from '../utils/invokeOrDefault.js';
import { throwError } from '../utils/throwError.js';

export const handleResponseError = (_response: IncomingMessage, onCancel: cancelHandler | undefined) => (error?: any) => {
  try {
    invokeOrDefault(onCancel, throwError, error)
  } catch (e) {
    cancelQueuedRequests(otherRequestError(error));
    throw e;
  }
}