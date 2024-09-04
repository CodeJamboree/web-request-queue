import { makeRequest } from "./makeRequest.js";
import { expect } from '../../scripts/utils/expect.js';
import { state, recentRequest, maxPerPeriod, secondsPerPeriod } from '../state.js';
import { httpsMocker } from "../../scripts/utils/httpsMocker.js";
import { mockFn } from "../../scripts/utils/mockFn.js";
import { requestArgs, RequestOptions, responseCallback } from '../global.js';

const setupDelay = (isDelayed = true) => {

  const date = new Date();
  if (!isDelayed)
    date.setTime(date.getTime() - 1000);
  state.setDate(recentRequest, date);
  state.setNum(secondsPerPeriod, 1);
  state.setNum(maxPerPeriod, 1);
}
export const requestDelayed = () => {
  setupDelay();
  const url = 'https://localhost';
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args: [url], onRequested, onCancel })
  expect(requested).is(false);
}
export const basicRequest = () => {
  setupDelay(false);
  const url = new URL('https://localhost');
  const options: RequestOptions = { servername: 'options' };
  const callback = mockFn();
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args: [url, options, callback], onRequested, onCancel })

  expect(requested).is(true);

  expect(httpsMocker.called()).is(true);
  const httpsArgs = httpsMocker.lastCall();
  expect(httpsArgs[0], 'url').equals(url);
  expect(httpsArgs[1], 'options').equals(options);
  expect(httpsArgs[2], 'callback').isFunction();

  expect(callback.lastCallArg()).instanceOf('MockResponse');
}
export const lastRequestUpdated = () => {
  setupDelay(false);
  const url = 'https://localhost';
  const options: RequestOptions = { servername: 'options' };
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args: [url, options], onRequested, onCancel })

  expect(requested).is(true);
  expect(state.getDate(recentRequest)).equals(new Date());
}
export const callbackForResponse = () => {
  setupDelay(false);
  const callback = mockFn();
  const args: requestArgs = [
    "my url",
    { servername: 'options' },
    callback
  ];
  const onRequested = undefined;
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel })
  expect(callback.lastCall()?.[0]).instanceOf('MockResponse');
}

export const callbackForRequest = () => {
  setupDelay(false);
  const args: [
    options: RequestOptions | string | URL,
    callback?: responseCallback
  ] | [
    url: string | URL,
    options: RequestOptions,
    callback?: responseCallback
  ] = [{}];
  const onRequested = mockFn();
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel })
  expect(onRequested.lastCall()?.[0], 'mock request').instanceOf('MockRequest');
}
