import { responseStatus, cascadingCancelation } from '../locale.js';
import { invoke } from '../utils/invoke.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';

interface status {
  statusCode?: number,
  statusMessage?: string
}
const redirection = 300;

export const handleResponseEnd = ({ statusCode, statusMessage }: status, onCancel: Function | undefined) => () => {
  if (statusCode === undefined || statusCode < redirection) return;
  const reason = responseStatus(statusCode, statusMessage);
  try {
    invoke(onCancel, reason);
  } finally {
    cancelQueuedRequests(cascadingCancelation(reason));
  }
}