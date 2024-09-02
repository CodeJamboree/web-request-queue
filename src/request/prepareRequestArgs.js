import { handleResponse } from './handleResponse.js';

export const prepareRequestArgs = (onCancel, first, ...rest) => {

  const type = typeof first;
  const args = [];
  let callback;

  if (first instanceof URL || type === 'string') {
    args.push(first);
    if (rest.length >= 1) args.push(rest[0]);
    callback = rest[1];
  } else {
    if (first || rest.length >= 1) args.push(first);
    callback = rest[0];
  }

  args.push(
    handleResponse(callback, onCancel)
  );

  return args;
}