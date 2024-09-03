import { handleResponseEnd } from "./handleResponseEnd.js";
import { handleResponseError } from "./handleResponseError.js";
import { cancelHandler, responseHandler } from "../types.js";


export const handleResponse = (
  callback: responseHandler | undefined,
  onCancel: cancelHandler | undefined
): responseHandler => (response) => {
  response.on('error', handleResponseError(response, onCancel));
  response.on('end', handleResponseEnd(response, onCancel));
  if (typeof callback === 'function') {
    callback(response);
  }
};