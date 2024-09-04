import https from 'https';
import { ClientRequest, IncomingMessage, responseCallback } from '../../src/global';

type handler = [name: string, handler: Function];
const original = {
  request: https.request.bind(https)
}

const calls: any[][] = [];
const requestHandlers: handler[] = [];
const responseHandlers: handler[] = [];

const resetHandlers = () => {
  calls.length = 0;
  requestHandlers.length = 0;
  responseHandlers.length = 0;
}

const emitRequest = (event: string, ...args: any[]) => {
  requestHandlers.forEach(([name, handler]) => {
    if (name === event) handler(...args);
  });
}
const emitResponse = (event: string, ...args: any[]) => {
  responseHandlers.forEach(([name, handler]) => {
    if (name === event) handler(...args);
  });
}
class MockRequest {
  on(event: string, cb: Function) {
    requestHandlers.push([event, cb])
  }
}
class MockResponse {
  statusCode = 200;
  statusMessage = 'OK';
  on(event: string, cb: Function) {
    responseHandlers.push([event, cb])
  }
}
const simpleRequest = (...args: any[]): ClientRequest => {
  let callback: responseCallback | undefined;
  switch (args.length) {
    case 2:
      if (typeof args[1] === 'function') callback = args[1];
      break;
    case 3:
      callback = args[2];
      break;
    default:
      break;
  }
  calls.push(args);
  const response = new MockResponse() as IncomingMessage;
  const request = new MockRequest() as ClientRequest;

  if (typeof callback === 'function') {
    callback(response);
  }
  return request;
}

const mock = () => {
  resetHandlers();
  https.request = simpleRequest;
}
const restore = () => {
  https.request = original.request;
}
const called = () => calls.length > 0;
const callAt = (index: number) => calls[index];
const lastCall = () => calls[calls.length - 1];

export const httpsMocker = {
  mock,
  restore,
  resetHandlers,
  emitRequest,
  emitResponse,
  called,
  callAt,
  lastCall
}
