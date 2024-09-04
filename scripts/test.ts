import * as stdout from "./utils/stdout.js";
import { state } from '../src/state.js';
import { stopTimers } from "../src/timers/stopTimers.js";
import { dateMocker } from "./utils/dateMocker.js";
import { httpsMocker } from "./utils/httpsMocker.js";
import { performanceMocker } from "./utils/performanceMocker.js";
import { ExpectationError } from './utils/ExpectationError.js';

import { getModules, ModuleList, Module } from './utils/getModules.js';
const excess = 10;

interface testState {
  passed: number,
  failed: number,
  skipped: number,
  failures: string[],
  hidePassing: boolean
}

const main = async () => {
  const suites = await getModules('build/src', /\.test\.js$/, '');

  const state: testState = {
    passed: 0,
    failed: 0,
    skipped: 0,
    failures: [],
    hidePassing: false
  }
  beforeAll();

  if (suites !== undefined)
    await runSuites(suites, state);

  afterAll();
  summarizeTests(state);
}

const runSuites = async (suites: ModuleList | Module, state: testState, depth = 0, location = '') => {
  const keys = Object.keys(suites);
  const indent = depth === 0 ? '' : ' '.repeat(depth);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key.startsWith("x_")) {
      console.info(`${indent}skip ${key}`);
      state.skipped++;
      continue;
    }

    console.info(`${indent}${key}`);
    const suite = suites[key];
    const suiteLocation = location === '' ? key : `${location}/${key}`;

    const tests = Object.entries(suite as Module).filter(([_name, test]) => typeof test === 'function');
    if (tests.length === 0) {
      await runSuites(suite as ModuleList, state, depth + 1, suiteLocation);
    } else {
      for (let i = 0; i < tests.length; i++) {
        await runTest(tests[i], i, tests, state, depth + 1, suiteLocation);
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
  httpsMocker.mock();
}
const afterEach = () => {
  dateMocker.restore();
  performanceMocker.restore();
  httpsMocker.restore();
  stdout.showOutput();
}
const runTest = async ([name, test]: [string, Function], i: number, a: any[], state: testState, depth: number, location: string) => {
  const indent = ' '.repeat(depth);
  if (name.startsWith('x_')) {
    state.skipped++;
    if (i < excess) {
      console.debug(`${indent}skip: ${name}`);
    } else if (i === excess) {
      console.debug(`${indent}...`);
    }
    return;
  }
  try {
    beforeEach();
    await test();
    state.passed++;
    afterEach();
    if (!state.hidePassing) {
      if (i < excess) {
        console.info(`${indent}pass: ${name}`);
      } else if (i === excess) {
        console.debug(`${indent}pass: ...`);
      } else if (i === a.length - 1) {
        console.info(`${indent}pass: ${name}`);
      }
    }
  } catch (e) {
    state.failed++;
    afterEach();
    state.failures.push(`${location} ${name} ${e}`);
    console.error(`${indent}fail: ${name} ${e}`);
    if ((e instanceof ExpectationError) && e.data) {
      writeExpectationData(e.data);
    }
    if (e instanceof Error) {
      console.debug(e.stack);
    }
  }
}
const summarizeTests = (state: testState) => {
  const {
    passed,
    failed,
    skipped,
    failures
  } = state;

  if (failures.length > 0) {
    console.group('Failures');
    failures.forEach(failure => {
      console.error(failure);
    });
    console.groupEnd();
  }

  if (passed + failed + skipped === 0) {
    console.error('No tests present');
  }
  if (passed !== 0) {
    console.info('Passed:', passed);
  }
  if (failed !== 0) {
    console.error('Failed:', failed);
  }
  if (skipped !== 0) {
    console.warn('Skipped:', skipped);
  }
  console.debug('Total:', passed + failed + skipped);
}
const writeExpectationData = (data: Record<string, any>) => {
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