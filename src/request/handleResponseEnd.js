import { cancelQueuedRequests } from './cancelQueuedRequests.js';

export const handleResponseEnd = (response, onCancel) => () => {
  const { statusCode, statusMessage } = response;
  if (statusCode >= 200 && statusCode < 300) return;
  const reason = `Unexpected Status ${statusCode}: ${statusMessage}`;
  try {
    if (typeof onCancel === 'function') {
      onCancel(reason);
    }
  } finally {
    cancelQueuedRequests(`A prior request ended with: ${reason}`);
  }
}