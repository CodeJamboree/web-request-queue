import { handleResponse } from "./handleResponse.js";
import { mockFn } from '../../scripts/utils/mockFn.js';
import { expect } from '../../scripts/utils/expect.js';

export const barbones = () => {
  const callback = undefined;
  const onCancel = undefined;
  const response = {
    on: () => { }
  };
  handleResponse(callback, onCancel)(response);
}
export const listenForError = () => {
  const mockOn = mockFn();

  const callback = undefined;
  const onCancel = undefined;
  const response = {
    on: mockOn
  };
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callAt(0)[0]).equals('error');
}
export const listenForEnd = () => {
  const mockOn = mockFn();

  const callback = undefined;
  const onCancel = undefined;
  const response = {
    on: mockOn
  };
  handleResponse(callback, onCancel)(response);
  expect(mockOn.callAt(1)[0]).equals('end');
}
export const passesResponseToCallback = () => {
  const mockCallback = mockFn();
  const onCancel = undefined;
  const response = {
    on: () => { }
  };
  handleResponse(mockCallback, onCancel)(response);
  expect(mockCallback.lastArgs()[0]).is(response);
}
export const invokesCancelOnError = () => {
  const mockCancel = mockFn();

  const callback = undefined;
  const handlers = [];
  const response = {
    on: (name, fn) => {
      handlers.push([name, fn]);
    }
  };
  handleResponse(callback, mockCancel)(response);

  handlers.forEach(([name, fn]) => {
    if (name === 'error') fn('the reason');
  });

  expect(mockCancel.lastArgs()).equals(['the reason']);
}
export const invokesCancelOnBadStatus = () => {
  const mockCancel = mockFn();

  const callback = undefined;
  const handlers = [];
  const response = {
    on: (name, fn) => {
      handlers.push([name, fn]);
    }
  };
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
  const handlers = [];
  const response = {
    on: (name, fn) => {
      handlers.push([name, fn]);
    }
  };
  handleResponse(callback, mockCancel)(response);

  response.statusCode = 200;
  response.statusMessage = 'OK!';
  handlers.forEach(([name, fn]) => {
    if (name === 'end') fn();
  });

  expect(mockCancel.callCount()).is(0);
}