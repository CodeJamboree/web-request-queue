import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { cascadingCancelation } from '../locale.js';
import { invoke } from '../utils/invoke.js';
import * as http from 'http';

export const handleRequestError = (_request: http.ClientRequest, onCancel: Function | undefined) => (error: Error) => {
  try {
    invoke(onCancel, error);
  } catch (e) {
    cancelQueuedRequests(cascadingCancelation(error));
    throw e;
  }
}