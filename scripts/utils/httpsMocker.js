import https from 'https';

const original = {
  request: https.request.bind(https)
}

const calls = [];
const requestHandlers = [];
const responseHandlers = [];

const resetHandlers = () => {
  calls.length = 0;
  requestHandlers.length = 0;
  responseHandlers.length = 0;
}

const emitRequest = (event, ...args) => {
  requestHandlers.forEach(([name, handler]) => {
    if (name === event) handler(...args);
  });
}
const emitResponse = (event, ...args) => {
  responseHandlers.forEach(([name, handler]) => {
    if (name === event) handler(...args);
  });
}
class MockRequest {
  on(event, cb) {
    requestHandlers.push([event, cb])
  }
}
class MockResponse {
  statusCode = 200;
  statusMessage = 'OK';
  on(event, cb) {
    responseHandlers.push([event, cb])
  }
}
const simpleRequest = (...args) => {
  calls.push(args);
  const response = new MockResponse();
  const request = new MockRequest();
  const callback = args[args.length - 1];
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
const callAt = (index) => calls[index];
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
