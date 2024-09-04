import http from 'http';
import { handleResponse } from "./handleResponse.js";
import { mockFn } from '../../scripts/utils/mockFn.js';
import { expect } from '../../scripts/utils/expect.js';
import { responseStatus } from "../locale.js";
import { IncomingMessage } from '../global.js';

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
  expect(mockCallback.lastCall()?.[0]).is(response);
}
export const invokesCancelOnError = () => {
  const mockCancel = mockFn();
  setupResponseError('the reason', mockCancel);
  expect(mockCancel.lastCallArg()).is('the reason');
}
export const fourOhFoured = () => {
  const mockCancel = mockFn();
  setupResponseEnd(404, 'Four Oh Foured!', mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(404, 'Four Oh Foured!'));
}

export const zero = () => {
  const mockCancel = mockFn();
  setupResponseEnd(0, 'Zero Intolerance Policy', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const one = () => {
  const mockCancel = mockFn();
  setupResponseEnd(1, 'One-Hit Wonder', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const informational = () => {
  const mockCancel = mockFn();
  setupResponseEnd(100, 'Continue', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const successCreated = () => {
  const mockCancel = mockFn();
  setupResponseEnd(201, 'Created', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const success = () => {
  const mockCancel = mockFn();
  setupResponseEnd(200, 'OK', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const redirection = () => {
  const mockCancel = mockFn();
  setupResponseEnd(300, 'Multiple Choices', mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(300, 'Multiple Choices'));
}
export const clientError = () => {
  const mockCancel = mockFn();
  setupResponseEnd(418, "I'm a teapot", mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(418, "I'm a teapot"));
}
export const serverError = () => {
  const mockCancel = mockFn();
  setupResponseEnd(500, 'Internal Server Error', mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(500, 'Internal Server Error'));
}
export const unrecognized = () => {
  const mockCancel = mockFn();
  setupResponseEnd(1003, "Please hold, we're taking a commercial break.", mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(1003, "Please hold, we're taking a commercial break."));
}
export const noStatusCode = () => {
  const mockCancel = mockFn();
  setupResponseEnd(undefined, 'Bad Status Message', mockCancel);
  expect(mockCancel.wasCalled()).is(false);
}
export const badCodeDefaultMessage = () => {
  const mockCancel = mockFn();
  setupResponseEnd(500, undefined, mockCancel);
  expect(mockCancel.lastCallArg()).is(responseStatus(500, undefined));
}
const setupResponseEnd = (code: number | undefined, message: string | undefined, onCancel: Function) => {
  const callback = undefined;
  const handlers: [string, Function][] = [];
  const response = mockResponse((name: string, fn: Function) => {
    handlers.push([name, fn]);
  });
  response.statusCode = code;
  response.statusMessage = message;
  handleResponse(callback, onCancel)(response);
  expect(response.statusCode).is(code);
  handlers.forEach(([name, fn]) => {
    if (name === 'end') fn();
  });
}
const setupResponseError = (error: any, onCancel: Function) => {
  const callback = undefined;
  const handlers: [string, Function][] = [];
  const response = mockResponse((name: string, fn: Function) => {
    handlers.push([name, fn]);
  });
  handleResponse(callback, onCancel)(response);
  handlers.forEach(([name, fn]) => {
    if (name === 'error') fn(error);
  });
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
  return response as IncomingMessage;
}