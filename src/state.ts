import { replaceActiveTimer } from "./locale.js";
import { queueParams } from "./types.js";
import { WebQueueError } from './WebQueueError.js';

type vars = 'state';
const vars: vars = 'state';
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
const datesKey = 'dates';
const timeoutsKey = 'timeouts';
const flagsKey = 'flags';
const numsKey = 'nums';
const arraysKey = 'arrays';

const timerKey = 'id';
const intervalKey = 'interval';

interface timeout {
  [timerKey]: NodeJS.Timeout | number | undefined,
  [intervalKey]: boolean
}

type collectionType = {
  [datesKey]: { [key in dateKeys]: Date | undefined },
  [timeoutsKey]: { [key in timerKeys]: timeout | undefined },
  [flagsKey]: { [key in booleanKeys]: boolean },
  [numsKey]: { [key in numericKeys]: number },
  [arraysKey]: { [key in arrayKeys]: any[] }
}

const vx: collectionType = {
  [datesKey]: {
    [recentRequest]: none,
    [firstRequest]: none
  },
  [flagsKey]: {
    [blocked]: false,
  },
  [arraysKey]: {
    [queue]: [],
  },
  [timeoutsKey]: {
    [queueInterval]: none,
    [queueTimeout]: none,
  },
  [numsKey]: {
    [requested]: 0,
    [expected]: 1,
    [maxPerPeriod]: 100,
    [secondsPerPeriod]: 60
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
export const startInterval = (key: intervalKeys, callback: Function, ms: number) => {
  setTimer(key, true, callback, ms);
}
export const startTimeout = (key: timeoutKeys, callback: Function, ms: number) => {
  setTimer(key, false, callback, ms);
}
const setTimer = (key: timerKeys, interval: boolean, callback: Function, ms: number) => {
  const existing = vx[timeoutsKey][key];
  if (existing) {
    throw new WebQueueError(replaceActiveTimer(key));
  }
  let timer;
  if (interval) {
    timer = setInterval(callback, ms);
  } else {
    timer = setTimeout(callback, ms);
  }
  vx[timeoutsKey][key] = {
    [timerKey]: timer,
    [intervalKey]: interval
  };
}
export const clearTimers = (...keys: timerKeys[]) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const timer = vx[timeoutsKey][key];
    if (timer) {
      const intervalId = timer[timerKey];
      if (timer[intervalKey]) {
        clearInterval(intervalId);
      } else {
        clearTimeout(intervalId);
      }
      vx[timeoutsKey][key] = none;
    }
  }
}
export const hasTimers = (...keys: timerKeys[]): boolean => {
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
    [firstRequest]: none
  };
  vx[flagsKey] = {
    [blocked]: false,
  };
  vx[arraysKey] = {
    [queue]: [],
  };
  vx[timeoutsKey] = {
    [queueInterval]: none,
    [queueTimeout]: none,
  };
  vx[numsKey] = {
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
