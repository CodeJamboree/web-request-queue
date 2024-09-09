import { handleResponseEnd } from "./handleResponseEnd.js";
import { handleResponseError } from "./handleResponseError.js";
import { invoke } from "../utils/invoke.js";
import http from 'http';

export const handleResponse = (
  callback: undefined | ((response: http.IncomingMessage) => void),
  onCancel: Function | undefined
) => {
  const responseCallbackWrapper = (response: http.IncomingMessage) => {
    response.on('error', handleResponseError(response, onCancel));
    response.on('end', handleResponseEnd(response, onCancel));
    invoke(callback, response);
  };
  return responseCallbackWrapper;
}