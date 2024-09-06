import * as https from 'https';
import { handleResponse } from './handleResponse.js';
import { WebQueueError } from '../WebQueueError.js';
import { outOfRange } from '../locale.js';
import { isFunction } from '../utils/isFunction.js';
import { requestArgs } from '../global.js';

export const wrapRequestArgsCallback = (onCancel: Function | undefined, requestArgs: requestArgs): requestArgs => {

  const count = requestArgs.length;
  const [urlOrOptions, optionsOrCallback, callback] = requestArgs;

  switch (count) {
    case 1:
      return [
        urlOrOptions,
        handleResponse(undefined, onCancel)
      ];
    case 2:
      if (isFunction(optionsOrCallback)) {
        return [
          urlOrOptions,
          handleResponse(
            optionsOrCallback,
            onCancel
          )
        ];
      } else {
        return [
          urlOrOptions as string | URL,
          optionsOrCallback as https.ServerOptions,
          handleResponse(undefined, onCancel)
        ];
      }
    case 3:
      return [
        urlOrOptions as string | URL,
        optionsOrCallback as https.RequestOptions,
        handleResponse(callback, onCancel)
      ];
    default:
      throw new WebQueueError(outOfRange('request', count, 1, 3));
  }
}