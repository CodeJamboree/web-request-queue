import https from 'https';
import { delayRequest } from './delayRequest.js';
import { beforeRequest } from './beforeRequest.js';
import { wrapRequestArgsCallback } from './wrapRequestArgsCallback.js';
import { handleRequestError } from './handleRequestError.js';
import { queueParams, RequestOptions, responseHandler } from '../types.js';


export const makeRequest = ({ args, onRequested, onCancel }: queueParams) => {

  if (delayRequest()) {
    return false;
  }

  beforeRequest();

  const preparedArgs = wrapRequestArgsCallback(onCancel, args);
  const [urlOrOptions, optionsOrCallback, callback] = preparedArgs;
  let clientRequest;

  switch (preparedArgs.length) {
    case 2:
      clientRequest = https.request(
        urlOrOptions as string | URL | RequestOptions,
        optionsOrCallback as responseHandler
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
      throw new Error(`Expected to have 2 - 3 arguments. Recieved ${preparedArgs.length}`);
  }

  clientRequest.on('error', handleRequestError(clientRequest, onCancel));

  if (typeof onRequested === 'function') {
    onRequested(clientRequest);
  }

  return true;
}
