import * as stdout from "../../scripts/utils/stdout.js";
import { expect } from '../../scripts/utils/expect.js';
import { expected, firstRequest, priorRemaining, priorTotal, queue, recentEval, requested, secondsPerEval, state } from '../state.js';
import { showProgress } from './showProgress.js';
import { dateMocker } from '../../scripts/utils/dateMocker.js';
import { performanceMocker } from "../../scripts/utils/performanceMocker.js";

const url = new URL("https://localhost");

export const justStarted = () => {
  performanceMocker.set(0);
  dateMocker.setUtc(2000, 0, 1);
  const expectedCount = 200;
  const requestCount = 10;
  state.setNow(firstRequest);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, expectedCount);
  state.append(queue, { args: [url] });
  state.setNum(priorRemaining, 1);
  state.setNum(priorTotal, expectedCount + 1);
  showProgress();
  expect(stdout.getBuffer()[0]).equals(
    `Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${expectedCount}\u001b[39m\n`
  );
}
export const after499Nanoseconds = () => {
  performanceMocker.set(.000499);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 0ms`
  );
}
export const after500Nanoseconds = () => {
  performanceMocker.set(.0005);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 0.001ms`
  );
}
export const afterMicrosecond = () => {
  performanceMocker.set(.001);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 0.001ms`
  );
}
export const afterMillisecond = () => {
  performanceMocker.set(1);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 1ms`
  );
}
export const afterSecond = () => {
  performanceMocker.set(1000);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 1.000s`
  );
}
export const afterMinute = () => {
  performanceMocker.set(1000 * 60);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 1:00.000 (m:ss.mmm)`
  );
}
export const afterHour = () => {
  performanceMocker.set(1000 * 60 * 60);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 1:00:00.000 (h:mm:ss.mmm)`
  );
}
export const afterDay = () => {
  performanceMocker.set(1000 * 60 * 60 * 24);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 24:00:00.000 (h:mm:ss.mmm)`
  );
}
export const afterYear = () => {
  performanceMocker.set(1000 * 60 * 60 * 24 * 365);
  const requested = 10;
  const total = 200;
  prepareState(requested, total);
  expect(stdout.getBuffer()[0]).startsWith(
    `Web Requests: 8760:00:00.000 (h:mm:ss.mmm)`
  );
}

export const noChangeSinceLast = () => {
  performanceMocker.set(0);
  const expectedCount = 200;
  const requestCount = 10;
  state.setNow(firstRequest);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, expectedCount);
  state.append(queue, { args: [url] });
  state.setNum(priorRemaining, expectedCount - requestCount);
  state.setNum(priorTotal, expectedCount);
  showProgress();
  expect(stdout.getBuffer()).equals([]);
}

export const withTimeRemaining = () => {
  performanceMocker.set(0);
  const expectedCount = 100;
  const requestCount = 10;
  const msPassed = 10;
  const msRemaining = "090";
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.setDate(firstRequest, firstAt);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, expectedCount);
  state.append(queue, { args: [url] });
  state.setNum(priorRemaining, expectedCount - requestCount);
  state.setNum(priorTotal, 1 + expectedCount);
  showProgress();
  expect(stdout.getBuffer()).equals([
    `Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${expectedCount}\u001b[39m ~ 0.${msRemaining}s\n`
  ]);
}

export const withPendingMoreThanTotal = () => {
  performanceMocker.set(0);
  const expectedCount = 2;
  const requestCount = 1;
  const msPassed = 10;
  const msRemaining = "020";
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.setDate(firstRequest, firstAt);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, expectedCount);
  state.append(queue, { args: [url] });
  state.append(queue, { args: [url] });
  const queueCount = 2;
  state.setNum(priorRemaining, expectedCount - requestCount);
  state.setNum(priorTotal, 1 + expectedCount);
  showProgress();
  expect(stdout.getBuffer()).equals([
    `Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m of \u001b[33m${requestCount + queueCount}\u001b[39m ~ 0.${msRemaining}s\n`
  ]);
}
export const withoutTotalOrPending = () => {
  performanceMocker.set(0);
  const expectedCount = 1;
  const requestCount = 1;
  const msPassed = 10;
  const firstAt = new Date();
  firstAt.setTime(firstAt.getTime() - msPassed);
  state.setDate(firstRequest, firstAt);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, expectedCount);
  state.removeAll(queue);
  state.setNum(priorRemaining, 999);
  state.setNum(priorTotal, 999);
  showProgress();
  const [message] = stdout.getBuffer();
  expect(message).equals(`Web Requests: 0ms \u001b[33m${requestCount}\u001b[39m\n`);
}
const setDelay = (ms: number) => {
  let progressSeconds = 10;
  state.setNum(secondsPerEval, progressSeconds);
  const date = new Date();
  date.setTime(date.getTime() - ((progressSeconds * 1000) - ms));
  state.setDate(recentEval, date);
}

const prepareState = (requestCount: number, total: number) => {
  dateMocker.setUtc(2000, 0, 1);
  state.setNow(firstRequest);
  setDelay(-1);
  state.setNum(requested, requestCount);
  state.setNum(expected, total);
  state.append(queue, { args: [url] });
  state.setNum(priorRemaining, 1);
  state.setNum(priorTotal, total + 1);
  showProgress();
}