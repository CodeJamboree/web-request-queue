import { replaceActiveTimer } from "./locale.js";
import { WebQueueError } from './WebQueueError.js';
import { queueParams } from "./global.js";

const none = undefined;

type recentRequest = 'recentRequest';
type firstRequest = 'firstRequest';
type dateKeys = recentRequest | firstRequest;

export const recentRequest: recentRequest = 'recentRequest';
export const firstRequest: firstRequest = 'firstRequest';

type queueInterval = 'queueInterval';
type queueTimeout = 'queueTimeout';

type timeoutKeys = queueTimeout;
type intervalKeys = queueInterval;

type timerKeys = timeoutKeys | intervalKeys;

export const queueInterval: queueInterval = 'queueInterval';
export const queueTimeout: queueTimeout = 'queueTimeout';

type booleanKeys = 'blocked';

export const blocked: booleanKeys = 'blocked';

type arrayKeys = 'queue';

export const queue: arrayKeys = 'queue';

type requested = 'requested';
type expected = 'expected';
type maxPerPeriod = 'maxPerPeriod';
type secondsPerPeriod = 'secondsPerPeriod';

type numericKeys = requested |
  expected |
  maxPerPeriod |
  secondsPerPeriod;

export const requested: requested = 'requested';
export const expected: expected = 'expected';
export const maxPerPeriod: maxPerPeriod = 'maxPerPeriod';
export const secondsPerPeriod: secondsPerPeriod = 'secondsPerPeriod';

type arrayType = queueParams;

const timerKey = 'id';
const intervalKey = 'interval';

interface timeout {
  [timerKey]: NodeJS.Timeout | number | undefined,
  [intervalKey]: boolean
}

type dateCollection = { [key in dateKeys]: Date | undefined };
type timeoutsCollection = { [key in timerKeys]: timeout | undefined };
type flagsCollection = { [key in booleanKeys]: boolean };
type numsCollection = { [key in numericKeys]: number };
type arraysCollection = { [key in arrayKeys]: any[] };

let dates: dateCollection = {
  [recentRequest]: none,
  [firstRequest]: none
};
let flags: flagsCollection = {
  [blocked]: false,
}
let arrays: arraysCollection = {
  [queue]: [],
};
let timeouts: timeoutsCollection = {
  [queueInterval]: none,
  [queueTimeout]: none,
}
let nums: numsCollection = {
  [requested]: 0,
  [expected]: 1,
  [maxPerPeriod]: 100,
  [secondsPerPeriod]: 60
};

export const setNum = (key: numericKeys, value: number) => {
  nums[key] = value;
}
export const increment = (key: numericKeys) => {
  nums[key]++;
}
export const getNum = (key: numericKeys): number => {
  return nums[key];
}
export const getDate = (key: dateKeys): Date | undefined => {
  return dates[key];
}
export const flagged = (key: booleanKeys): boolean => {
  return flags[key];
}
export const setDate = (key: dateKeys, value: Date | undefined) => {
  dates[key] = value;
}
export const setNow = (key: dateKeys) => {
  setDate(key, new Date());
}
export const removeDate = (key: dateKeys) => {
  setDate(key, none);
}
export const startInterval = (key: intervalKeys, callback: Function, ms: number) => {
  setTimer(key, true, callback, ms);
}
export const startTimeout = (key: timeoutKeys, callback: Function, ms: number) => {
  setTimer(key, false, callback, ms);
}
const setTimer = (key: timerKeys, interval: boolean, callback: Function, ms: number) => {
  const existing = timeouts[key];
  if (existing) {
    throw new WebQueueError(replaceActiveTimer(key));
  }
  let timer;
  if (interval) {
    timer = setInterval(callback, ms);
  } else {
    timer = setTimeout(callback, ms);
  }
  timeouts[key] = {
    [timerKey]: timer,
    [intervalKey]: interval
  };
}
export const clearTimers = (...keys: timerKeys[]) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const timer = timeouts[key];
    if (timer) {
      const intervalId = timer[timerKey];
      if (timer[intervalKey]) {
        clearInterval(intervalId);
      } else {
        clearTimeout(intervalId);
      }
      timeouts[key] = none;
    }
  }
}
export const hasTimers = (...keys: timerKeys[]): boolean => {
  return keys.some(key => timeouts[key]);
}
export const flag = (key: booleanKeys, value: boolean = true) => {
  flags[key] = value;
}
const getArray = <T extends arrayType>(key: arrayKeys): T[] => {
  return arrays[key] as T[];
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
  dates = {
    [recentRequest]: none,
    [firstRequest]: none
  };
  flags = {
    [blocked]: false,
  };
  arrays = {
    [queue]: [],
  };
  timeouts = {
    [queueInterval]: none,
    [queueTimeout]: none,
  };
  nums = {
    [requested]: 0,
    [expected]: 1,
    [maxPerPeriod]: 100,
    [secondsPerPeriod]: 60
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
  startInterval,
  startTimeout,
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
