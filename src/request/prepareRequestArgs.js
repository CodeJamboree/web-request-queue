import { handleResponse } from './handleResponse.js';

export const prepareRequestArgs = (onCancel, first, ...rest) => {

  const type = typeof first;
  const args = [];

  if (first instanceof URL || type === 'string') {
    args.push(first);
    [options, callback] = rest;
  } else {
    options = first;
    [callback] = rest;
  }

  args.push(
    options,
    handleResponse(callback, onCancel)
  );

  return args;
}