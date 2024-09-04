import { handleResponseEnd } from "./handleResponseEnd.js";
import { handleResponseError } from "./handleResponseError.js";
import { invoke } from "../utils/invoke.js";
import { responseCallback } from '../global.js';

export const handleResponse = (
  callback: undefined | responseCallback,
  onCancel: Function | undefined
): responseCallback => (response) => {
  response.on('error', handleResponseError(response, onCancel));
  response.on('end', handleResponseEnd(response, onCancel));
  invoke(callback, response);
};