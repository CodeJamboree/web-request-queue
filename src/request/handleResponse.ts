import { handleResponseEnd } from "./handleResponseEnd";
import { handleResponseError } from "./handleResponseError";
import { cancelHandler, responseHandler } from "../types";

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