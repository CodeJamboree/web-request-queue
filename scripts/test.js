import * as stdout from "./utils/stdout.js";
import { state } from '../src/state.js';
import { stopTimers } from "../src/timers/stopTimers.js";
import { timeLogger } from '../src/progress/timeLogger.js';
import { dateMocker } from "./utils/dateMocker.js";
import { performanceMocker } from "./utils/performanceMocker.js";
import { ExpectationError } from './utils/ExpectationError.js';

import { getModules } from './utils/getModules.js';
const excess = 10;

const main = async () => {
  const suites = await getModules('scripts/tests');
  const state = {
    passed: 0,
    failed: 0,
    skipped: 0
  }
  beforeAll();

  await runSuites(suites, state);

  afterAll();
  summarizeTests(state);
}

const runSuites = async (suites, state, depth = 0) => {
  const keys = Object.keys(suites);
  const indent = depth === 0 ? '' : ' '.repeat(depth);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    console.info(`${indent}${key}`);
    const suite = suites[key];

    const tests = Object.values(suite).filter(test => typeof test === 'function');
    if (tests.length === 0) {
      await runSuites(suite, state, depth + 1);
    } else {
      for (let i = 0; i < tests.length; i++) {
        const pass = await runTest(tests[i], i, tests, depth + 1);
        if (pass) state.passed++; else state.failed++;
      }
    }
  }
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
const runTest = async (test, i, a, depth) => {
  const { name } = test;
  const indent = ' '.repeat(depth);
  try {
    beforeEach();
    await test();
    afterEach();
    if (i < excess) {
      console.info(`${indent}pass: ${name}`);
    } else if (i === excess) {
      console.debug(`${indent}pass: ...`);
    } else if (i === a.length - 1) {
      console.info(`${indent}pass: ${name}`);
    }
    return true;
  } catch (e) {
    afterEach();
    console.error(`${indent}fail: ${name} ${e}`);
    if (!(e instanceof ExpectationError)) {
      console.debug(e.stack);
    } else if (e.data) {
      writeExpectatinData(e.data);
    }
    return false;
  }
}
const summarizeTests = (state) => {
  const {
    passed,
    failed,
    skipped
  } = state;

  const args = [];
  if (failed > 0) {
    args.push(failed, 'tests failed');
  }
  if (passed > 0) {
    args.push(passed, 'of', passed + failed, 'tests passed');
  }

  if (skipped > 0) {
    args.push(skipped, 'test skipped');
  }

  if (failed > 0) {
    console.error('Failed:', ...args);
  } else if (passed > 0) {
    console.info('Success:', ...args);
  } else if (skipped > 0) {
    console.info('Skipped:', ...args);
  } else {
    console.info('No tests found.');
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