import { handleResponse } from "./handleResponse.js";
import { mockFn } from '../../scripts/utils/mockFn.js';
import { expect } from '../../scripts/utils/expect.js';
import { IncomingMessage } from "../types.js";

export const barbones = () => {
  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse();
  handleResponse(callback, onCancel)(response);
}
export const listenForError = () => {
  const mockOn = mockFn();

  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse(mockOn);
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callAt(0)[0]).equals('error');
}
export const listenForEnd = () => {
  const mockOn = mockFn();

  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse(mockOn);
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callAt(1)[0]).equals('end');
}
export const passesResponseToCallback = () => {
  const mockCallback = mockFn();
  const onCancel = undefined;
  const response = mockResponse();
  handleResponse(mockCallback, onCancel)(response);
  expect(mockCallback.lastArgs()?.[0]).is(response);
}
export const invokesCancelOnError = () => {
  const mockCancel = mockFn();

  const callback = undefined;
  const handlers: [name: string, handler: Function][] = [];
  const response = mockResponse((name: string, fn: Function) => {
    handlers.push([name, fn]);
  });
  handleResponse(callback, mockCancel)(response);

  handlers.forEach(([name, fn]) => {
    if (name === 'error') fn('the reason');
  });

  expect(mockCancel.lastArgs()).equals(['the reason']);
}
export const invokesCancelOnBadStatus = () => {
  const mockCancel = mockFn();

  const callback = undefined;
  const handlers: [string, Function][] = [];
  const response = mockResponse((name: string, fn: Function) => {
    handlers.push([name, fn]);
  });
  handleResponse(callback, mockCancel)(response);

  response.statusCode = 404;
  response.statusMessage = 'Bad Status Message';
  handlers.forEach(([name, fn]) => {
    if (name === 'end') fn();
  });

  expect(mockCancel.lastArgs()).equals(['Unexpected Status 404: Bad Status Message']);
}
export const goodStatusDoesNotInvokeCancel = () => {
  const mockCancel = mockFn();

  const callback = undefined;
  const handlers: [string, Function][] = [];
  const response = mockResponse((name: string, fn: Function) => {
    handlers.push([name, fn]);
  });
  handleResponse(callback, mockCancel)(response);

  response.statusCode = 200;
  response.statusMessage = 'OK!';
  handlers.forEach(([name, fn]) => {
    if (name === 'end') fn();
  });

  expect(mockCancel.callCount()).is(0);
}


const mockResponse = (onFunction?: Function): IncomingMessage => {
  const response = {
    statusCode: 200,
    statusMessage: 'OK',
    on: (...args: any[]) => {
      if (onFunction) onFunction(...args);
      return response;
    }
  };
  return response;
}