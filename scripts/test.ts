import * as stdout from "./utils/stdout.js";
import { state } from '../src/state.js';
import { stopTimers } from "../src/timers/stopTimers.js";
import { dateMocker } from "./utils/dateMocker.js";
import { httpsMocker } from "./utils/httpsMocker.js";
import { performanceMocker } from "./utils/performanceMocker.js";
import { ExpectationError } from './utils/ExpectationError.js';
import { getModules, ModuleList, Module } from './utils/getModules.js';

/*
All functions in target modules are considered as tests
Any function prefixed with SKIP_PREFIX is skipped
Any function prefixed with FOCUS_PREFIX is focused, causing other tests to be skipped
A focused test within a module bubbled up, so that only focused tests accross all modules are ran
Any modules file name prefixed with SKIP_PREFIX and FOCUS_PREFIX obeys the same rules.
*/

const TEST_FOLDER = "build/src";
const TEST_FILE_PATTERN = /\.test\.js$/;
const TEST_FILE_REPLACEMENT = '';
const SKIP_PREFIX = "x_";
const FOCUS_PREFIX = "f_";
const EXCESS_TESTS = Infinity; // zero to hide; Infinity to show all; Otherwise hide after X passed (per suite)

interface testState {
  passed: number,
  failed: number,
  skipped: number,
  failures: string[],
  hasFocused: boolean
}
type SuiteInfo = {
  focused?: boolean
  runnable: number
}
interface TestSuite extends SuiteInfo {
  tests: {
    [test: string]: Function
  }
}
interface TestSuites extends SuiteInfo {
  suites: {
    [key: string]: TestSuites | TestSuite
  }
}

const main = async () => {
  let modules = await getModules(TEST_FOLDER, TEST_FILE_PATTERN, TEST_FILE_REPLACEMENT);
  if (!modules) {
    console.error('No tests found');
    return;
  }
  const state: testState = {
    passed: 0,
    failed: 0,
    skipped: 0,
    failures: [],
    hasFocused: false
  }
  const testSuites = modulesAsTestSuites(state, modules, false);
  if (!testSuites) {
    if (state.skipped > 0) {
      console.log('All tests skipped', state.skipped);
    } else {
      console.error('No valid tests found.');
    }
    return;
  }

  beforeAll();

  await runSuites(testSuites, state);

  afterAll();
  summarizeTests(state);
}

// Indent is specifically to prevent altering tests that evaluate
// the stdout buffer. Otherwise console.group/groupEnd could be used.
const indent = (depth: number, message: string): string => {
  let space = depth === 0 ? '' : ' '.repeat(depth * 2);
  return `${space}${message}`;
}
const runSuites = async (suites: TestSuites, state: testState, depth = 0, location = '') => {
  const keys = Object.keys(suites.suites);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    console.info(indent(depth, key));
    const suiteLocation = location === '' ? key : `${location}/${key}`;
    const info = suites.suites[key];
    if ('suites' in info) {
      await runSuites(info, state, depth + 1, suiteLocation)
    } else {
      const tests = Object.entries(info.tests);
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
  try {
    beforeEach();
    await test();
    state.passed++;
    afterEach();
    if (EXCESS_TESTS > 0) {
      if (i < EXCESS_TESTS) {
        console.info(indent(depth, `pass: ${name}`));
      } else if (i === EXCESS_TESTS) {
        console.debug(indent(depth, `pass: ...`));
      } else if (i === a.length - 1) {
        console.info(indent(depth, `pass: ${name}`));
      }
    }
  } catch (e) {
    state.failed++;
    afterEach();
    state.failures.push(`${location} ${name} ${e}`);
    console.error(indent(depth, `fail: ${name} ${e}`));
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

const isModule = (value: ModuleList | Module): value is Module => {
  return Object.keys(value).some(key => typeof value[key] === 'function');
}

const modulesAsTestSuites = (state: testState, moduleOrList: ModuleList, skip: boolean): TestSuites | undefined => {
  const keys = Object.keys(moduleOrList);
  const filtered: TestSuites = {
    focused: false,
    runnable: 0,
    suites: {}
  };
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const target = moduleOrList[key];
    let item: TestSuite | TestSuites | undefined = undefined;
    const skipItem = skip || key.startsWith('x_');
    if (isModule(target)) {
      item = moduleAsTestSuite(state, target, skipItem);
    } else {
      item = modulesAsTestSuites(state, target as ModuleList, skipItem);
    }
    if (item) {
      if (key.startsWith(FOCUS_PREFIX)) {
        item.focused = true;
      }
      if (item.focused) {
        filtered.focused = true;
      }
      filtered.suites[key] = item;
    }
  }

  if (filtered.focused) {
    Object.keys(filtered.suites).forEach(key => {
      const suite = filtered.suites[key];
      if (suite.focused === false) {
        state.skipped += suite.runnable;
        delete filtered.suites[key];
      }
    });
  }

  filtered.runnable = Object.keys(filtered.suites).reduce(
    (sum, key) => sum + filtered.suites[key].runnable, 0);

  return filtered.runnable === 0 ? undefined : filtered;
}
const moduleAsTestSuite = (state: testState, module: Module, skip: boolean): TestSuite | undefined => {
  const keys = Object.keys(module);
  const testKeys = keys.filter(key => typeof module[key] === 'function');
  const focusedTests = testKeys.filter(key => key.startsWith(FOCUS_PREFIX));
  if (focusedTests.length !== 0) state.hasFocused = true;
  if (skip || testKeys.length === 0) {
    state.skipped += testKeys.length;
    return;
  }
  const skippedTests = testKeys.filter(key => key.startsWith(SKIP_PREFIX));
  const unskippedTests = testKeys.filter(key => !key.startsWith(SKIP_PREFIX));
  state.skipped += skippedTests.length;
  if (unskippedTests.length === 0) return;
  if (focusedTests.length === 0) {
    return unskippedTests.reduce<TestSuite>(
      (suite, key) => {
        suite.tests[key] = module[key];
        return suite;
      },
      {
        runnable: unskippedTests.length,
        focused: false,
        tests: {}
      }
    );
  }
  state.skipped += unskippedTests.length - focusedTests.length;
  return focusedTests.reduce<TestSuite>(
    (suite, key) => {
      suite.tests[key] = module[key];
      return suite;
    }, {
    runnable: focusedTests.length,
    focused: true,
    tests: {}
  })
}