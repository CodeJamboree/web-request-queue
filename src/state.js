const NO_DATE = new Date(0);
const NO_NUM = Number.MIN_SAFE_INTEGER;

const initialState = {
  lastAt: NO_DATE,
  firstAt: NO_DATE,
  progressedAt: NO_DATE,

  isBlocked: false,

  queue: [],

  progressIntervalId: NO_NUM,
  progressTimeoutId: NO_NUM,
  pendingIntervalId: NO_NUM,
  pendingTimeoutId: NO_NUM,

  requestCount: 0,
  expectedCount: 1,
  priorRemainingCount: 0,
  priorPresumedTotal: 0,
  throttleCount: 100,
  throttleSeconds: 60,
  progressSeconds: 15
};

class State {
  state = {};

  constructor() {
    this.reset();
  }
  get(key) {
    this.ensureNotArray(key);
    const value = this.state[key];
    if (value === NO_DATE || value === NO_NUM) return;
    return value;
  }
  set(key, value) {
    this.ensureNotArray(key);
    this.ensureType(key, value);
    this.state[key] = value;
  }
  count(key) {
    this.ensureArray(key);
    return this.state[key].length;
  }
  append(key, value) {
    this.ensureArray(key);
    this.state[key].push(value);
  }
  prepend(key, value) {
    this.ensureArray(key);
    this.state[key].unshift(value);
  }
  removeFirst(key) {
    this.ensureArray(key);
    return this.state[key].shift();
  }
  removeAll(key) {
    this.ensureArray(key);
    return this.state[key].splice(0);
  }
  remove(key) {
    this.ensureNotArray(key);
    const original = initialState[key];
    switch (original) {
      case NO_DATE:
        this.state[key] = NO_DATE;
        break;
      case NO_NUM:
        this.state[key] = NO_NUM;
      default:
        throw new Error(`Unable to remove ${key}`);
    }
  }
  reset() {
    this.state = { ...initialState };
    const keys = Object.keys(this.state);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (Array.isArray(this.state[key])) {
        this.state[key] = this.state[key].slice();
      }
    };
  }
  ensureType(key, value) {
    this.ensureKeyExists(key);
    const valueType = typeof value;
    const originalKeyValue = initialState[key];
    const keyType = typeof originalKeyValue;
    if (valueType !== keyType) {
      throw new `Unable to set ${key} as ${valueType}. Expected ${keyType}.`
    }

    if (keyType === 'object') {
      if (originalKeyValue instanceof Date) {
        if (!(value instanceof Date)) {
          throw new `Expected ${key} to be date. ${value}`;
        }
      } else if (Array.isArray(originalKeyValue)) {
        throw new `Unable to set ${key} directly. Use append, prepend, removeAll, removeFirst`;
      }
    }
  }
  ensureNumeric(key) {
    this.ensureKeyExists(key);
    if (typeof this.state[key] !== 'number') {
      throw new Error(`${key} is not a number`);
    }
  }
  ensureKeyExists(key) {
    if (!(key in this.state)) {
      throw new Error(`${key} is not recognized`);
    }
  }
  ensureArray(key) {
    this.ensureKeyExists(key);
    if (!Array.isArray(this.state[key])) {
      throw new Error(`${key} is not an array.`);
    }
  }
  ensureNotArray(key) {
    this.ensureKeyExists(key);
    if (Array.isArray(this.state[key])) {
      throw new Error(`${key} is an array.`);
    }
  }
}

export const state = new State();
