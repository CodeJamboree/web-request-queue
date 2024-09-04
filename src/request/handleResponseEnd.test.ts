import { handleResponseEnd } from "./handleResponseEnd.js";
import { mockFn } from '../../scripts/utils/mockFn.js';
import { expect } from '../../scripts/utils/expect.js';
import { queue, state } from '../state.js';
import { cascadingCancelation, responseStatus } from "../locale.js";
import { IncomingMessage } from '../global.js';

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
  const onCancel = mockFn();
  handleResponseEnd(response, onCancel)();
  expect(onCancel.lastCall()).equals([responseStatus(429, 'Too Many Requests')])
}

export const badResponseCancelsQueue = () => {
  const onCancel = mockFn();
  const onQueuedCancel = mockFn();
  state.append(queue, {
    args: [url],
    onCancel: onQueuedCancel
  });

  const response = mockResponse(401, 'Unauthorized');
  handleResponseEnd(response, onCancel)();

  expect(state.empty(queue), 'queue.count').is(true);
  expect(onCancel.lastCall(), 'onCancel.lastCall').equals([responseStatus(401, 'Unauthorized')]);
  expect(onQueuedCancel.callCount(), 'onQueuedCancel.callCount').is(1);
  expect(onQueuedCancel.lastCall(), 'onQueuedCancel.lastCall').equals(
    [cascadingCancelation(responseStatus(401, 'Unauthorized'))]);
}

const mockResponse = (statusCode: number, statusMessage: string): IncomingMessage => {
  const response = {
    statusCode,
    statusMessage,
    on: () => response
  };
  return response as unknown as IncomingMessage;
}