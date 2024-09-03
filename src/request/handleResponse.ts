import { handleResponseEnd } from "./handleResponseEnd.js";
import { handleResponseError } from "./handleResponseError.js";
import { cancelHandler, responseHandler } from "../types.js";
import { invoke } from "../utils/invoke.js";


export const handleResponse = (
  callback: responseHandler | undefined,
  onCancel: cancelHandler | undefined
): responseHandler => (response) => {
  response.on('error', handleResponseError(response, onCancel));
  response.on('end', handleResponseEnd(response, onCancel));
  invoke(callback, response);
};