import { handleResponse } from "./handleResponse.js";
import { expect, mockFunction } from '@codejamboree/js-test';
import { responseStatus } from "../locale.js";
import * as http from 'http';

export const barbones = () => {
  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse();
  handleResponse(callback, onCancel)(response);
}
export const listenForError = () => {
  const mockOn = mockFunction();

  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse(mockOn);
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callArg(0, 0)).equals('error');
}
export const listenForEnd = () => {
  const mockOn = mockFunction();

  const callback = undefined;
  const onCancel = undefined;
  const response = mockResponse(mockOn);
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callArg(1, 0)).equals('end');
}
export const passesResponseToCallback = () => {
  const mockCallback = mockFunction();
  const onCancel = undefined;
  const response = mockResponse();
  handleResponse(mockCallback, onCancel)(response);
  expect(mockCallback.callArg(-1, 0)).is(response);
}
export const invokesCancelOnError = () => {
  const mockCancel = mockFunction();
  setupResponseError('the reason', mockCancel);
  expect(mockCancel.callArg(-1, 0)).is('the reason');
}
export const fourOhFoured = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(404, 'Four Oh Foured!', mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(404, 'Four Oh Foured!'));
}

export const zero = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(0, 'Zero Intolerance Policy', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const one = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(1, 'One-Hit Wonder', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const informational = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(100, 'Continue', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const successCreated = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(201, 'Created', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const success = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(200, 'OK', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const redirection = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(300, 'Multiple Choices', mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(300, 'Multiple Choices'));
}
export const clientError = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(418, "I'm a teapot", mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(418, "I'm a teapot"));
}
export const serverError = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(500, 'Internal Server Error', mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(500, 'Internal Server Error'));
}
export const unrecognized = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(1003, "Please hold, we're taking a commercial break.", mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(1003, "Please hold, we're taking a commercial break."));
}
export const noStatusCode = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(undefined, 'Bad Status Message', mockCancel);
  expect(mockCancel.called()).is(false);
}
export const badCodeDefaultMessage = () => {
  const mockCancel = mockFunction();
  setupResponseEnd(500, undefined, mockCancel);
  expect(mockCancel.callArg(-1, 0)).is(responseStatus(500, undefined));
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
  const mockCancel = mockFunction();

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


const mockResponse = (onFunction?: Function): http.IncomingMessage => {
  const response = {
    statusCode: 200,
    statusMessage: 'OK',
    on: (...args: any[]) => {
      if (onFunction) onFunction(...args);
      return response;
    }
  };
  return response as http.IncomingMessage;
}