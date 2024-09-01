import * as stdout from "./utils/stdout.js";
import { state } from '../src/state.js';
import { stopTimers } from "../src/timers/stopTimers.js";
import { timeLogger } from '../src/progress/timeLogger.js';

import * as setThrottleMaxTests from './tests/setThrottleMax.js';
import * as setThrottlePeriodTests from './tests/setThrottlePeriod.js';
import * as msPerRequestTests from './tests/msPerRequest.js';
import * as delayProgressTests from './tests/progress/delayProgress.js';
import * as msPerProgressTests from './tests/progress/msPerProgress.js';
import * as showProgressTests from './tests/progress/showProgress.js';

const excess = 10;

const main = async () => {
  const suites = [
    setThrottleMaxTests,
    setThrottlePeriodTests,
    msPerRequestTests,
    delayProgressTests,
    msPerProgressTests,
    showProgressTests
  ];

  let passed = 0;
  let failed = 0;

  beforeAll();
  for (let s = 0; s < suites.length; s++) {
    let suite = suites[s];
    const tests = Object.values(suite).filter(test => typeof test === 'function');
    console.debug(suite.name ?? `Suite ${s + 1}`);
    for (let i = 0; i < tests.length; i++) {
      const pass = await runTest(tests[i], i, tests);
      if (pass) passed++; else failed++;
    }
  }
  afterAll();
  summarizeTests(passed, failed);
}

const beforeAll = () => {
  stdout.enableBuffer();
  stdout.resetBuffer();
}
const afterAll = () => {
  stdout.showOutput();
  stdout.disableBuffer();
}
const beforeEach = () => {
  stopTimers();
  state.reset();
  stdout.resetBuffer();
  stdout.hideOutput();
}
const afterEach = () => {
  timeLogger.stop();
  stdout.showOutput();
}
const runTest = async (test, i, a) => {
  const { name } = test;
  try {
    beforeEach();
    await test();
    afterEach();
    console.group();
    if (i < excess) {
      console.info(`pass: ${name}`);
    } else if (i === excess) {
      console.debug('pass: ...');
    } else if (i === a.length - 1) {
      console.info(`pass: ${name}`);
    }
    console.groupEnd();
    return true;
  } catch (e) {
    afterEach();
    console.group();
    console.error(`fail: ${name} ${e}`);
    console.groupEnd();
    return false;
  }
}
const summarizeTests = (passed, failed) => {
  const total = passed + failed;
  if (failed === 0) {
    console.info('Success:', passed, 'of', total, 'tests passed.');
  } else {
    console.error('Failed:', failed, 'and', passed, 'of', total, 'passed.');
  }
}

try {
  console.info('Test')
  main()
    .catch(e => console.error(e))
    .finally(() => console.info('done'));
} catch (e) {
  console.error(e);
  console.info('done');
}