import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cascadingCancelation } from '../locale.js';
import { invokeOrDefault } from '../utils/invokeOrDefault.js';
import { throwError } from '../utils/throwError.js';

export const handleResponseError = (_response: any, onCancel: Function | undefined) => (error?: any) => {
  try {
    invokeOrDefault(onCancel, throwError, error)
  } catch (e) {
    cancelQueuedRequests(cascadingCancelation(error));
    throw e;
  }
}