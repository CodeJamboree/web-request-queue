import { handleResponseEnd } from "./handleResponseEnd.js";
import { handleResponseError } from "./handleResponseError.js";

export const handleResponse = (callback, onCancel) => (response) => {
  response.on('error', handleResponseError(response, onCancel));
  response.on('end', handleResponseEnd(response, onCancel));
  if (typeof callback === 'function') {
    callback(response);
  }
};