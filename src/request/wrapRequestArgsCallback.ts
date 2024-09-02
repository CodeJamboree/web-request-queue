import { handleResponse } from './handleResponse.js';
import { cancelHandler, requestArgs, RequestOptions } from '../types.js';

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
      if (typeof optionsOrCallback === 'function') {
        return [
          urlOrOptions,
          handleResponse(optionsOrCallback, onCancel)
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
      throw new Error(`Expected 1 to 3 arguments for request. Received ${count}`);
  }
}