import * as stdout from "../../utils/stdout.js";
import { expect } from '../../utils/expect.js';
import { state } from '../../../src/state.js';
import { showProgress } from '../../../src/progress/showProgress.js';

export const name = 'showProgress';

export const showProgressNeverRequested = () => {
  state.remove('firstRequest');
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}
export const showProgressTooSoon = () => {
  state.set('firstRequest', new Date());
  setDelay(10);
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}
export const showProgressJustStartedNow = () => {
  const totalExpected = 200;
  const requestCount = 10;
  state.set('firstRequest', new Date());
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('totalExpected', totalExpected);
  state.append('queue', 1);
  state.set('priorRemainingCount', 1);
  state.set('priorPresumedTotal', totalExpected + 1);
  showProgress();
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith("Web Requests: 0.");
  expect(message).endsWith(`ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${totalExpected}\u001b[39m\n`);
}

export const showProgressNoChangeSinceLast = () => {
  const totalExpected = 200;
  const requestCount = 10;
  state.set('firstRequest', new Date());
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('totalExpected', totalExpected);
  state.append('queue', 1);
  state.set('priorRemainingCount', totalExpected - requestCount);
  state.set('priorPresumedTotal', totalExpected);
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}

export const showProgressWithTimeRemaining = () => {
  const totalExpected = 100;
  const requestCount = 10;
  const msPassed = 10;
  const firstRequest = new Date();
  firstRequest.setTime(firstRequest.getTime() - msPassed);
  state.set('firstRequest', firstRequest);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('totalExpected', totalExpected);
  state.append('queue', 1);
  state.set('priorRemainingCount', totalExpected - requestCount);
  state.set('priorPresumedTotal', 1 + totalExpected);
  showProgress();
  const msRemaining = 900;
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith("Web Requests: 0.");
  expect(message).endsWith(`ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${totalExpected}\u001b[39m ~ 0.${msRemaining}s\n`);
}

export const showProgressWithPendingMoreThanTotal = () => {
  const totalExpected = 2;
  const requestCount = 1;
  const msPassed = 10;
  const firstRequest = new Date();
  firstRequest.setTime(firstRequest.getTime() - msPassed);
  state.set('firstRequest', firstRequest);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('totalExpected', totalExpected);
  state.append('queue', 1);
  state.append('queue', 1);
  const queueCount = 2;
  state.set('priorRemainingCount', totalExpected - requestCount);
  state.set('priorPresumedTotal', 1 + totalExpected);
  showProgress();
  const msRemaining = 200;
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith("Web Requests: 0.");
  expect(message).endsWith(`ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${requestCount + queueCount}\u001b[39m ~ 0.${msRemaining}s\n`);
}
export const showProgressWithoutTotalOrPending = () => {
  const totalExpected = undefined;
  const requestCount = 1;
  const msPassed = 10;
  const firstRequest = new Date();
  firstRequest.setTime(firstRequest.getTime() - msPassed);
  state.set('firstRequest', firstRequest);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('totalExpected', totalExpected);
  state.removeAll('queue');
  state.set('priorRemainingCount', 999);
  state.set('priorPresumedTotal', 999);
  showProgress();
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith("Web Requests: 0.");
  expect(message).endsWith(`ms \u001b[33m${requestCount}\u001b[39m\n`);
}
const setDelay = (ms) => {
  let progressSeconds = 10;
  state.set('progressSeconds', progressSeconds);
  const date = new Date();
  date.setTime(date.getTime() - ((progressSeconds * 1000) - ms));
  state.set('lastProgress', date);
}
