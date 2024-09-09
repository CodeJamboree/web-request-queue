import { makeRequest } from "./makeRequest.js";
import { expect, mockFunction, httpUtils, dateUtils } from '@codejamboree/js-test';
import { state, recentRequest, maxPerPeriod, secondsPerPeriod } from '../state.js';
import { requestArgs } from '../global.js';
import * as https from 'https';
import * as http from 'http';

export const beforeEach = () => {
  httpUtils.mock();
  dateUtils.freeze();
}
export const afterEach = () => {
  httpUtils.restore();
  dateUtils.restore();
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
export const basicRequest = () => new Promise<void>((resolve) => {
  setupDelay(false);
  const url = new URL('https://localhost');
  const options: https.RequestOptions = { servername: 'options' };
  const callback = mockFunction((res: http.IncomingMessage) => {
    expect(res).instanceOf('FakeIncomingMessage');
    resolve();
  });
  const onRequested = (req: http.ClientRequest) => {
    expect(req).instanceOf('FakeClientRequest');
    req.end();
  };
  const onCancel = undefined;
  const requested = makeRequest({ args: [url, options, callback], onRequested, onCancel });
  expect(requested).is(true);
});

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
export const responseCallbackAsArgs = () => new Promise<void>((resolve, reject) => {
  setupDelay(false);
  const callback = (res: http.IncomingMessage) => {
    expect(res).instanceOf('FakeIncomingMessage');
    resolve();
  };
  const args: requestArgs = [
    "https://localhost",
    { servername: 'options' },
    callback
  ];
  const onRequested = (req: http.ClientRequest) => req.end();
  const onCancel = undefined;
  makeRequest({ args, onRequested, onCancel });
});

