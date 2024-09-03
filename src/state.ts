import { queueParams } from "./types.js";

type dateKeys = 'lastAt' |
  'firstAt' |
  'progressedAt'
type timeoutKeys = 'progressIntervalId' |
  'progressTimeoutId' |
  'queueIntervalId' |
  'queueTimeoutId';
type booleanKeys = 'isBlocked';
type arrayKeys = 'queue';
type numericKeys = 'requestCount' |
  'expectedCount' |
  'priorRemainingCount' |
  'priorPresumedTotal' |
  'throttleCount' |
  'throttleSeconds' |
  'progressSeconds';

type arrayType = queueParams;

type collectionType = {
  dates: { [key in dateKeys]: Date | undefined },
  timeouts: { [key in timeoutKeys]: NodeJS.Timeout | number | undefined },
  flags: { [key in booleanKeys]: boolean },
  nums: { [key in numericKeys]: number },
  arrays: { [key in arrayKeys]: any[] }
}

class State {
  state: collectionType = {
    dates: {
      lastAt: undefined,
      firstAt: undefined,
      progressedAt: undefined,
    },
    flags: {
      isBlocked: false,
    },
    arrays: {
      queue: [],
    },
    timeouts: {
      progressIntervalId: undefined,
      progressTimeoutId: undefined,
      queueIntervalId: undefined,
      queueTimeoutId: undefined,
    },
    nums: {
      requestCount: 0,
      expectedCount: 1,
      priorRemainingCount: 0,
      priorPresumedTotal: 0,
      throttleCount: 100,
      throttleSeconds: 60,
      progressSeconds: Infinity
    }
  };

  getNum(key: numericKeys): number {
    return this.state.nums[key];
  }
  increment(key: numericKeys) {
    this.state.nums[key]++;
  }
  getDate(key: dateKeys): Date | undefined {
    return this.state.dates[key];
  }
  getTimeout(key: timeoutKeys): number | NodeJS.Timeout | undefined {
    return this.state.timeouts[key];
  }
  flagged(key: booleanKeys): boolean {
    return this.state.flags[key];
  }
  setNum(key: numericKeys, value: number) {
    this.state.nums[key] = value;
  }
  setDate(key: dateKeys, value: Date | undefined) {
    this.state.dates[key] = value;
  }
  setNow(key: dateKeys) {
    this.setDate(key, new Date());
  }
  removeDate(key: dateKeys) {
    this.setDate(key, undefined);
  }
  setTimeout(key: timeoutKeys, value: number | NodeJS.Timeout | undefined) {
    const existing = this.state.timeouts[key];
    if (typeof existing === 'object' && '_destroyed' in existing && (!existing._destroyed)) {
      throw new Error(`Attempted to replace ${key} before it was destroyed.`);
    }
    this.state.timeouts[key] = value;
  }
  removeTimeout(key: timeoutKeys) {
    this.setTimeout(key, undefined);
  }
  flag(key: booleanKeys, value: boolean = true) {
    this.state.flags[key] = value;
  }
  private getArray<T extends arrayType>(key: arrayKeys): T[] {
    return this.state.arrays[key] as T[];
  }
  count<T extends arrayType>(key: arrayKeys) {
    return this.getArray<T>(key).length;
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
    this.state = {
      dates: {
        lastAt: undefined,
        firstAt: undefined,
        progressedAt: undefined,
      },
      flags: {
        isBlocked: false,
      },
      arrays: {
        queue: [],
      },
      timeouts: {
        progressIntervalId: undefined,
        progressTimeoutId: undefined,
        queueIntervalId: undefined,
        queueTimeoutId: undefined,
      },
      nums: {
        requestCount: 0,
        expectedCount: 1,
        priorRemainingCount: 0,
        priorPresumedTotal: 0,
        throttleCount: 100,
        throttleSeconds: 60,
        progressSeconds: Infinity
      }
    }
  }
}

export const state = new State();
