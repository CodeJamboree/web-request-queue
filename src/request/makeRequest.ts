import https from 'https';
import { delayRequest } from './delayRequest.js';
import { beforeRequest } from './beforeRequest.js';
import { wrapRequestArgsCallback } from './wrapRequestArgsCallback.js';
import { handleRequestError } from './handleRequestError.js';
import { WebQueueError } from '../WebQueueError.js';
import { outOfRange } from '../locale.js';
import { invoke } from '../utils/invoke.js';
import { queueParams, RequestOptions, responseCallback } from '../global.js';

export const makeRequest = ({ args, onRequested, onCancel }: queueParams) => {

  if (delayRequest()) {
    return false;
  }

  beforeRequest();

  const preparedArgs = wrapRequestArgsCallback(onCancel, args);
  const [urlOrOptions, optionsOrCallback, callback] = preparedArgs;
  let clientRequest;
  const count = preparedArgs.length;
  switch (count) {
    case 2:
      clientRequest = https.request(
        urlOrOptions as string | URL | RequestOptions,
        optionsOrCallback as responseCallback
      );
      break;
    case 3:
      clientRequest = https.request(
        urlOrOptions as URL | string,
        optionsOrCallback as RequestOptions,
        callback
      );
      break;
    default:
      throw new WebQueueError(outOfRange('args', count, 2, 3));
  }

  clientRequest.on('error', handleRequestError(clientRequest, onCancel));

  invoke(onRequested, clientRequest);

  return true;
}
