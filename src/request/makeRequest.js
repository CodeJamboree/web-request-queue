import https from 'https';
import { delayRequest } from './delayRequest.js';
import { beforeRequest } from './beforeRequest.js';
import { prepareRequestArgs } from './prepareRequestArgs.js';

export const makeRequest = ({ args, onRequested, onCancel }) => {

  if (delayRequest()) {
    return false;
  }

  beforeRequest();

  const preparedArgs = prepareRequestArgs(onCancel, ...args);

  const clientRequest = https.request(...preparedArgs);

  if (typeof onRequested === 'function') {
    onRequested(clientRequest);
  }

  return true;
}
