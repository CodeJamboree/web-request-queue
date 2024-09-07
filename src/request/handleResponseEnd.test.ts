import { handleResponseEnd } from "./handleResponseEnd.js";
import { expect, mockFunction } from '@codejamboree/js-test';
import { queue, state } from '../state.js';
import { cascadingCancelation, responseStatus } from "../locale.js";
import * as http from 'http';

const url = new URL('https://localhost');

export const ok = () => {
  const response = mockResponse(200, 'OK');
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const created = () => {
  const response = mockResponse(201, 'Created');
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const notFound = () => {
  const response = mockResponse(404, 'Not Found');
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const badResponseInvokesCancel = () => {
  const response = mockResponse(429, 'Too Many Requests');
  const onCancel = mockFunction();
  handleResponseEnd(response, onCancel)();
  expect(onCancel.callAt(-1)).equals([responseStatus(429, 'Too Many Requests')])
}

export const badResponseCancelsQueue = () => {
  const onCancel = mockFunction();
  const onQueuedCancel = mockFunction();
  state.append(queue, {
    args: [url],
    onCancel: onQueuedCancel
  });

  const response = mockResponse(401, 'Unauthorized');
  handleResponseEnd(response, onCancel)();

  expect(state.empty(queue), 'queue.count').is(true);
  expect(onCancel.callAt(-1), 'onCancel.lastCall').equals([responseStatus(401, 'Unauthorized')]);
  expect(onQueuedCancel.callCount(), 'onQueuedCancel.callCount').is(1);
  expect(onQueuedCancel.callAt(-1), 'onQueuedCancel.lastCall').equals(
    [cascadingCancelation(responseStatus(401, 'Unauthorized'))]);
}

const mockResponse = (statusCode: number, statusMessage: string): http.IncomingMessage => {
  const response = {
    statusCode,
    statusMessage,
    on: () => response
  };
  return response as unknown as http.IncomingMessage;
}