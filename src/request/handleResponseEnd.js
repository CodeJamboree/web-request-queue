import { stopPendingRequests } from './cancelQueuedRequests.js';

export const handleResponseEnd = (response, onCancel) => () => {
  const { statusCode = 200, statusMessage } = response;
  if (statusCode === 200) return;
  const reason = `Unexpected Status ${statusCode}: ${statusMessage}`;
  try {
    if (typeof onCancel === 'function') {
      return onCancel(reason);
    } else {
      throw new Error(reason);
    }
  } catch (e) {
    stopPendingRequests(`A prior request ended with: ${reason}`);
    throw e;
  }
}