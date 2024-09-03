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

class State {
  [vars]: collectionType = {
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

  setNum(key: numericKeys, value: number) {
    this[vars][numsKey][key] = value;
  }
  increment(key: numericKeys) {
    this[vars][numsKey][key]++;
  }
  getNum(key: numericKeys): number {
    return this[vars][numsKey][key];
  }
  getDate(key: dateKeys): Date | undefined {
    return this[vars][datesKey][key];
  }
  flagged(key: booleanKeys): boolean {
    return this[vars][flagsKey][key];
  }
  setDate(key: dateKeys, value: Date | undefined) {
    this[vars][datesKey][key] = value;
  }
  setNow(key: dateKeys) {
    this.setDate(key, new Date());
  }
  removeDate(key: dateKeys) {
    this.setDate(key, none);
  }
  setTimeout(key: timeoutKeys, type: timeoutType, callback: Function, ms: number) {
    const existing = this[vars][timeoutsKey][key];
    if (existing && existing.active) {
      throw new WebQueueError(replaceActiveTimer(key));
    }
    let timer;
    if (type === 'interval') {
      timer = setInterval(callback, ms);
    } else {
      timer = setTimeout(callback, ms);
    }
    this[vars][timeoutsKey][key] = {
      type,
      timer,
      active: true
    };
  }
  clearTimeouts(...keys: timeoutKeys[]) {
    keys.forEach(key => {
      const timeout = this[vars][timeoutsKey][key];
      if (timeout) {
        if (timeout.type === 'interval') {
          clearInterval(timeout.timer);
        } else {
          clearTimeout(timeout.timer);
        }
        timeout.active = false;
      }
      this[vars][timeoutsKey][key] = none;
    })
  }
  hasTimeouts(...keys: timeoutKeys[]): boolean {
    return keys.some(key => this[vars][timeoutsKey][key]);
  }
  flag(key: booleanKeys, value: boolean = true) {
    this[vars][flagsKey][key] = value;
  }
  private getArray<T extends arrayType>(key: arrayKeys): T[] {
    return this[vars][arraysKey][key] as T[];
  }
  count<T extends arrayType>(key: arrayKeys) {
    return this.getArray<T>(key).length;
  }
  empty<T extends arrayType>(key: arrayKeys) {
    return this.getArray<T>(key).length === 0;
  }
  append<T extends arrayType>(key: arrayKeys, value: T) {
    this.getArray(key).push(value);
  }
  prepend<T extends arrayType>(key: arrayKeys, value: T) {
    this.getArray(key).unshift(value);
  }
  removeFirst<T extends arrayType>(key: arrayKeys): T | undefined {
    return this.getArray<T>(key).shift();
  }
  removeAll<T extends arrayType>(key: arrayKeys): T[] {
    return this.getArray<T>(key).splice(0);
  }
  reset() {
    this[vars] = {
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
    }
  }
}

export const state = new State();
