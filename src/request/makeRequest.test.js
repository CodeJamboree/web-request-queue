import { makeRequest } from "./makeRequest.js";
import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { httpsMocker } from "../../scripts/utils/httpsMocker.js";
import { mockFn } from "../../scripts/utils/mockFn.js";

const setupDelay = (isDelayed = true) => {

  const date = new Date();
  if (!isDelayed)
    date.setTime(date.getTime() - 1000);
  state.set('lastAt', date);
  state.set('throttleSeconds', 1);
  state.set('throttleCount', 1);
}
export const requestDelayed = () => {
  setupDelay();
  const args = [];
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args, onRequested, onCancel })
  expect(requested).is(false);
}
export const basicRequest = () => {
  setupDelay(false);
  const url = 'my url';
  const options = { my: 'options' };
  const callback = mockFn();
  const args = [url, options, callback];
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args, onRequested, onCancel })

  expect(requested).is(true);

  expect(httpsMocker.called()).is(true);
  const httpsArgs = httpsMocker.lastCall();
  expect(httpsArgs[0], 'url').equals(url);
  expect(httpsArgs[1], 'options').equals(options);
  expect(httpsArgs[2], 'callback').isFunction();

  expect(callback.lastArgs()[0]).instanceOf('MockResponse');
}
export const lastRequestUpdated = () => {
  setupDelay(false);
  const args = [];
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args, onRequested, onCancel })

  expect(requested).is(true);
  expect(state.get('lastAt')).equals(new Date());
}
export const callbackForResponse = () => {
  setupDelay(false);
  const callback = mockFn();
  const args = [
    "my url",
    { my: 'options' },
    callback
  ];
  const onRequested = undefined;
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel })
  expect(callback.lastArgs()[0]).instanceOf('MockResponse');
}

export const callbackForRequest = () => {
  setupDelay(false);
  const args = [];
  const onRequested = mockFn();
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel })
  expect(onRequested.lastArgs()[0], 'mock request').instanceOf('MockRequest');
}
