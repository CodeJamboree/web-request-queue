import { cancelQueuedRequests } from './cancelQueuedRequests';
import { cancelHandler, IncomingMessage } from '../types';

export const handleResponseEnd = (response: IncomingMessage, onCancel: cancelHandler | undefined) => () => {
  const { statusCode = 200, statusMessage = '(no message)' } = response;
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