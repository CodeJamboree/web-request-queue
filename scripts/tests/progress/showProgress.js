import * as stdout from "../../utils/stdout.js";
import { expect } from '../../utils/expect.js';
import { state } from '../../../src/state.js';
import { showProgress } from '../../../src/progress/showProgress.js';
import { dateMocker } from '../../utils/dateMocker.js';
import { performanceMocker } from "../../utils/performanceMocker.js";

export const name = 'showProgress';

export const showProgressNeverRequested = () => {
  state.remove('firstAt');
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}
export const showProgressTooSoon = () => {
  state.set('firstAt', new Date());
  setDelay(10);
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}
export const showProgressJustStartedNow = () => {
  performanceMocker.set(0);
  dateMocker.setUtc(2000, 0, 1);
  const expectedCount = 200;
  const requestCount = 10;
  state.set('firstAt', new Date());
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('expectedCount', expectedCount);
  state.append('queue', 1);
  state.set('priorRemainingCount', 1);
  state.set('priorPresumedTotal', expectedCount + 1);
  showProgress();
  const [[message]] = stdout.getBuffer();
  expect(message).equals(
    `Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${expectedCount}\u001b[39m\n`
  );
}
const foo = (requested, total) => {
  dateMocker.setUtc(2000, 0, 1);
  state.set('firstAt', new Date());
  setDelay(-1);
  state.set('requestCount', requested);
  state.set('expectedCount', total);
  state.append('queue', 1);
  state.set('priorRemainingCount', 1);
  state.set('priorPresumedTotal', total + 1);
  showProgress();
}
export const showProgressAfter499Nanoseconds = () => {
  performanceMocker.set(.000499);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 0ms`
  );
}
export const showProgressAfter500Nanoseconds = () => {
  performanceMocker.set(.0005);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 0.001ms`
  );
}
export const showProgressAfterMicrosecond = () => {
  performanceMocker.set(.001);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 0.001ms`
  );
}
export const showProgressAfterMillisecond = () => {
  performanceMocker.set(1);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 1ms`
  );
}
export const showProgressAfterSecond = () => {
  performanceMocker.set(1000);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 1.000s`
  );
}
export const showProgressAfterMinute = () => {
  performanceMocker.set(1000 * 60);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 1:00.000 (m:ss.mmm)`
  );
}
export const showProgressAfterHour = () => {
  performanceMocker.set(1000 * 60 * 60);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 1:00:00.000 (h:mm:ss.mmm)`
  );
}
export const showProgressAfterDay = () => {
  performanceMocker.set(1000 * 60 * 60 * 24);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 24:00:00.000 (h:mm:ss.mmm)`
  );
}
export const showProgressAfterYear = () => {
  performanceMocker.set(1000 * 60 * 60 * 24 * 365);
  const requested = 10;
  const total = 200;
  foo(requested, total);
  const [[message]] = stdout.getBuffer();
  expect(message).startsWith(
    `Web Requests: 8760:00:00.000 (h:mm:ss.mmm)`
  );
}

export const showProgressNoChangeSinceLast = () => {
  performanceMocker.set(0);
  const expectedCount = 200;
  const requestCount = 10;
  state.set('firstAt', new Date());
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('expectedCount', expectedCount);
  state.append('queue', 1);
  state.set('priorRemainingCount', expectedCount - requestCount);
  state.set('priorPresumedTotal', expectedCount);
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}

export const showProgressWithTimeRemaining = () => {
  performanceMocker.set(0);
  const expectedCount = 100;
  const requestCount = 10;
  const msPassed = 10;
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.set('firstAt', firstAt);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('expectedCount', expectedCount);
  state.append('queue', 1);
  state.set('priorRemainingCount', expectedCount - requestCount);
  state.set('priorPresumedTotal', 1 + expectedCount);
  showProgress();
  const msRemaining = 900;
  const [[message]] = stdout.getBuffer();
  expect(message).equals(`Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${expectedCount}\u001b[39m ~ 0.${msRemaining}s\n`);
}

export const showProgressWithPendingMoreThanTotal = () => {
  performanceMocker.set(0);
  const expectedCount = 2;
  const requestCount = 1;
  const msPassed = 10;
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.set('firstAt', firstAt);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('expectedCount', expectedCount);
  state.append('queue', 1);
  state.append('queue', 1);
  const queueCount = 2;
  state.set('priorRemainingCount', expectedCount - requestCount);
  state.set('priorPresumedTotal', 1 + expectedCount);
  showProgress();
  const msRemaining = 200;
  const [[message]] = stdout.getBuffer();
  expect(message).equals(`Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${requestCount + queueCount}\u001b[39m ~ 0.${msRemaining}s\n`);
}
export const showProgressWithoutTotalOrPending = () => {
  performanceMocker.set(0);
  const expectedCount = 1;
  const requestCount = 1;
  const msPassed = 10;
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.set('firstAt', firstAt);
  setDelay(-1);
  state.set('requestCount', requestCount);
  state.set('expectedCount', expectedCount);
  state.removeAll('queue');
  state.set('priorRemainingCount', 999);
  state.set('priorPresumedTotal', 999);
  showProgress();
  const [[message]] = stdout.getBuffer();
  expect(message).equals(`Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m\n`);
}
const setDelay = (ms) => {
  let progressSeconds = 10;
  state.set('progressSeconds', progressSeconds);
  const date = new Date();
  date.setTime(date.getTime() - ((progressSeconds * 1000) - ms));
  state.set('progressedAt', date);
}
