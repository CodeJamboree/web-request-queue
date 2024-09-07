import { makeRequest } from "./makeRequest.js";
import { expect, mockFunction } from '@codejamboree/js-test/development';
import { state, recentRequest, maxPerPeriod, secondsPerPeriod } from '../state.js';
import { httpsMocker, MockResponse } from "../../scripts/utils/httpsMocker.js";
import { requestArgs, responseCallback } from '../global.js';
import * as https from 'https';
import { invoke } from "../utils/invoke.js";


export const beforeEach = () => {
  httpsMocker.mock();
}
export const afterEach = () => {
  httpsMocker.restore();
}
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
  const options: https.RequestOptions = { servername: 'options' };
  const callback = mockFunction();
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args: [url, options, callback], onRequested, onCancel })

  expect(requested).is(true);

  expect(httpsMocker.called()).is(true);
  const httpsArgs = httpsMocker.lastCall();
  expect(httpsArgs[0], 'url').equals(url);
  expect(httpsArgs[1], 'options').equals(options);
  expect(httpsArgs[2], 'callback').isFunction();

  expect(callback.callArg(-1, 0)).instanceOf('MockResponse');
}
export const lastRequestUpdated = () => {
  setupDelay(false);
  const url = 'https://localhost';
  const options: https.RequestOptions = { servername: 'options' };
  const onRequested = undefined;
  const onCancel = undefined;
  const requested = makeRequest({ args: [url, options], onRequested, onCancel })

  expect(requested).is(true);
  expect(state.getDate(recentRequest)).equals(new Date());
}
export const callbackForResponse = () => {
  setupDelay(false);
  const callback = mockFunction();
  const args: requestArgs = [
    "https://localhost",
    { servername: 'options' },
    callback
  ];
  const onRequested = undefined;
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel });
  expect(callback.callArg(-1, 0)).instanceOf(MockResponse);
}

export const callbackForRequest = () => {
  setupDelay(false);
  const args: [
    options: https.RequestOptions | string | URL,
    callback?: responseCallback
  ] | [
    url: string | URL,
    options: https.RequestOptions,
    callback?: responseCallback
  ] = [{}];
  const onRequested = mockFunction();
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel })
  expect(onRequested.callArg(-1, 0), 'mock request').instanceOf('MockRequest');
}
