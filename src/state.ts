import { replaceActiveTimer } from "./locale.js";
import { queueParams } from "./types.js";
import { WebQueueError } from './WebQueueError.js';

type vars = 'state';
const vars: vars = 'state';
const none = undefined;

type recentRequest = 'recentRequest';
type firstRequest = 'firstRequest';
type recentEval = 'recentEval';
type dateKeys = recentRequest | firstRequest | recentEval;

export const recentRequest: recentRequest = 'recentRequest';
export const firstRequest: firstRequest = 'firstRequest';
export const recentEval: recentEval = 'recentEval';

type evalInterval = 'evalInterval';
type evalTimeout = 'evalTimeout';
type queueInterval = 'queueInterval';
type queueTimeout = 'queueTimeout';

type timeoutKeys = evalInterval |
  evalTimeout |
  queueInterval |
  queueTimeout;

export const evalInterval: evalInterval = 'evalInterval';
export const evalTimeout: evalTimeout = 'evalTimeout';
export const queueInterval: queueInterval = 'queueInterval';
export const queueTimeout: queueTimeout = 'queueTimeout';

type booleanKeys = 'blocked';

export const blocked: booleanKeys = 'blocked';

type arrayKeys = 'queue';

export const queue: arrayKeys = 'queue';

type requested = 'requested';
type expected = 'expected';
type priorRemaining = 'priorRemaining';
type priorTotal = 'priorTotal';
type maxPerPeriod = 'maxPerPeriod';
type secondsPerPeriod = 'secondsPerPeriod';
type secondsPerEval = 'secondsPerEval';

type numericKeys = requested |
  expected |
  priorRemaining |
  priorTotal |
  maxPerPeriod |
  secondsPerPeriod |
  secondsPerEval;

export const requested: requested = 'requested';
export const expected: expected = 'expected';
export const priorRemaining: priorRemaining = 'priorRemaining';
export const priorTotal: priorTotal = 'priorTotal';
export const maxPerPeriod: maxPerPeriod = 'maxPerPeriod';
export const secondsPerPeriod: secondsPerPeriod = 'secondsPerPeriod';
export const secondsPerEval: secondsPerEval = 'secondsPerEval';

type arrayType = queueParams;
const datesKey = 'dates';
const timeoutsKey = 'timeouts';
const flagsKey = 'flags';
const numsKey = 'nums';
const arraysKey = 'arrays';

type timeoutType = 'interval' | 'timeout';
interface timeout {
  timer: NodeJS.Timeout | number | undefined,
  type: timeoutType,
  active: boolean
}

type collectionType = {
  [datesKey]: { [key in dateKeys]: Date | undefined },
  [timeoutsKey]: { [key in timeoutKeys]: timeout | undefined },
  [flagsKey]: { [key in booleanKeys]: boolean },
  [numsKey]: { [key in numericKeys]: number },
  [arraysKey]: { [key in arrayKeys]: any[] }
}

const vx: collectionType = {
  [datesKey]: {
    [recentRequest]: none,
    [firstRequest]: none,
    [recentEval]: none,
  },
  [flagsKey]: {
    [blocked]: false,
  },
  [arraysKey]: {
    [queue]: [],
  },
  [timeoutsKey]: {
    [evalInterval]: none,
    [evalTimeout]: none,
    [queueInterval]: none,
    [queueTimeout]: none,
  },
  [numsKey]: {
    [requested]: 0,
    [expected]: 1,
    [priorRemaining]: 0,
    [priorTotal]: 0,
    [maxPerPeriod]: 100,
    [secondsPerPeriod]: 60,
    [secondsPerEval]: Infinity
  }
};

export const setNum = (key: numericKeys, value: number) => {
  vx[numsKey][key] = value;
}
export const increment = (key: numericKeys) => {
  vx[numsKey][key]++;
}
export const getNum = (key: numericKeys): number => {
  return vx[numsKey][key];
}
export const getDate = (key: dateKeys): Date | undefined => {
  return vx[datesKey][key];
}
export const flagged = (key: booleanKeys): boolean => {
  return vx[flagsKey][key];
}
export const setDate = (key: dateKeys, value: Date | undefined) => {
  vx[datesKey][key] = value;
}
export const setNow = (key: dateKeys) => {
  setDate(key, new Date());
}
export const removeDate = (key: dateKeys) => {
  setDate(key, none);
}
export const setTimer = (key: timeoutKeys, type: timeoutType, callback: Function, ms: number) => {
  const existing = vx[timeoutsKey][key];
  if (existing && existing.active) {
    throw new WebQueueError(replaceActiveTimer(key));
  }
  let timer;
  if (type === 'interval') {
    timer = setInterval(callback, ms);
  } else {
    timer = setTimeout(callback, ms);
  }
  vx[timeoutsKey][key] = {
    type,
    timer,
    active: true
  };
}
export const clearTimers = (...keys: timeoutKeys[]) => {
  keys.forEach(key => {
    const timeout = vx[timeoutsKey][key];
    if (timeout) {
      if (timeout.type === 'interval') {
        clearInterval(timeout.timer);
      } else {
        clearTimeout(timeout.timer);
      }
      timeout.active = false;
    }
    vx[timeoutsKey][key] = none;
  })
}
export const hasTimers = (...keys: timeoutKeys[]): boolean => {
  return keys.some(key => vx[timeoutsKey][key]);
}
export const flag = (key: booleanKeys, value: boolean = true) => {
  vx[flagsKey][key] = value;
}
const getArray = <T extends arrayType>(key: arrayKeys): T[] => {
  return vx[arraysKey][key] as T[];
}
export const count = <T extends arrayType>(key: arrayKeys) => {
  return getArray<T>(key).length;
}
export const empty = <T extends arrayType>(key: arrayKeys) => {
  return getArray<T>(key).length === 0;
}
export const append = <T extends arrayType>(key: arrayKeys, value: T) => {
  getArray(key).push(value);
}
export const prepend = <T extends arrayType>(key: arrayKeys, value: T) => {
  getArray(key).unshift(value);
}
export const removeFirst = <T extends arrayType>(key: arrayKeys): T | undefined => {
  return getArray<T>(key).shift();
}
export const removeAll = <T extends arrayType>(key: arrayKeys): T[] => {
  return getArray<T>(key).splice(0);
}
export const reset = () => {
  vx[datesKey] = {
    [recentRequest]: none,
    [firstRequest]: none,
    [recentEval]: none,
  };
  vx[flagsKey] = {
    [blocked]: false,
  };
  vx[arraysKey] = {
    [queue]: [],
  };
  vx[timeoutsKey] = {
    [evalInterval]: none,
    [evalTimeout]: none,
    [queueInterval]: none,
    [queueTimeout]: none,
  };
  vx[numsKey] = {
    [requested]: 0,
    [expected]: 1,
    [priorRemaining]: 0,
    [priorTotal]: 0,
    [maxPerPeriod]: 100,
    [secondsPerPeriod]: 60,
    [secondsPerEval]: Infinity
  }
}

export const state = {
  setNum,
  increment,
  getNum,
  getDate,
  flagged,
  setDate,
  setNow,
  removeDate,
  setTimer,
  clearTimers,
  hasTimers,
  flag,
  count,
  empty,
  append,
  prepend,
  removeFirst,
  removeAll,
  reset
}
