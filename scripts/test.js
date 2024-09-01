import * as stdout from "./utils/stdout.js";
import { state } from '../src/state.js';
import { stopTimers } from "../src/timers/stopTimers.js";
import { timeLogger } from '../src/progress/timeLogger.js';
import { dateMocker } from "./utils/dateMocker.js";
import { performanceMocker } from "./utils/performanceMocker.js";
import { ExpectationError } from './utils/ExpectationError.js';

import * as setThrottleMaxTests from './tests/setThrottleMax.js';
import * as setThrottlePeriodTests from './tests/setThrottlePeriod.js';
import * as msPerRequestTests from './tests/request/msPerRequest.js';
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
  stdout.hideOutput();

  stopTimers();
  state.reset();

  stdout.resetBuffer();

  dateMocker.freeze();
  performanceMocker.freeze();
}
const afterEach = () => {
  timeLogger.stop();
  dateMocker.restore();
  performanceMocker.restore();
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
    console.group();
    if (!(e instanceof ExpectationError)) {
      console.debug(e.stack);
    } else if (e.data) {
      writeExpectatinData(e.data);
    }
    console.groupEnd();
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
const writeExpectatinData = data => {
  Object.keys(data).forEach(key => {
    switch (key) {
      case 'expected':
      case 'expectedValue':
        console.info('Expected:', data[key]);
        break;
      case 'actual':
      case 'actualValue':
        console.info('Actual:', data[key]);
        break;
      case 'details':
        if (data[key] !== undefined) {
          console.debug('Details:', data[key]);
        }
        break;
      default:
        console.debug(`${key}:`, data[key]);
    }
  })
}

try {
  console.info('Test')
  main()
    .catch(e => console.error(e))
    .finally(() => {
      console.info('done');
    });
} catch (e) {
  console.error(e);
  console.info('done');
}