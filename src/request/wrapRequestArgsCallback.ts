import { handleResponse } from './handleResponse.js';
import { cancelHandler, requestArgs, RequestOptions, responseHandler } from '../types.js';
import { WebQueueError } from '../WebQueueError.js';
import { wrongArgCount } from '../locale.js';
import { isFunction } from '../utils/isFunction.js';

export const wrapRequestArgsCallback = (onCancel: cancelHandler | undefined, requestArgs: requestArgs): requestArgs => {

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
          optionsOrCallback as RequestOptions,
          handleResponse(undefined, onCancel)
        ];
      }
    case 3:
      return [
        urlOrOptions as string | URL,
        optionsOrCallback as RequestOptions,
        handleResponse(callback, onCancel)
      ];
    default:
      throw new WebQueueError(wrongArgCount('request', count, 1, 3));
  }
}