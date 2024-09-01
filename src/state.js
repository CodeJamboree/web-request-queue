const initialState = {
  lastRequest: undefined,
  firstRequest: undefined,
  lastProgress: undefined,
  requestCount: 0,
  totalExpected: 0,
  priorRemainingCount: 0,
  priorPresumedTotal: 0,
  allowNewRequests: true,
  queue: [],
  progressIntervalId: undefined,
  progressTimeoutId: undefined,
  pendingIntervalId: undefined,
  pendingTimeoutId: undefined,
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
    return this.state[key];
  }
  increment(key) {
    this.ensureNumeric(key);
    this.state[key]++;
  }
  set(key, value) {
    this.ensureNotArray(key);
    if (typeof value === 'object') {
      if (!(value instanceof Date)) {
        throw new Error(`Attempted to store object in ${key}`);
      }
    }
    this.state[key] = value;
  }
  setNow(key) {
    this.ensureDate(key);
    this.state[key] = new Date();
  }
  append(key, value) {
    this.ensureArray(key);
    this.state[key].push(value);
  }
  prepend(key, value) {
    this.ensureArray(key);
    this.state[key].unshift(value);
  }
  first(key) {
    this.ensureArray(key);
    return this.state[key].shift();
  }
  count(key) {
    this.ensureArray(key);
    return this.state[key].length;
  }
  hasNone(key) {
    return this.count(key) === 0;
  }
  copyAll(key) {
    this.ensureArray(key);
    return this.state[key].slice();
  }
  removeAll(key) {
    this.ensureArray(key);
    return this.state[key].length = 0;
  }
  remove(key) {
    this.ensureNotArray(key);
    this.state[key] = undefined;
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
  ensureDate(key) {
    this.ensureKeyExists(key);
    if (this.state[key] === 'undefined') return;
    if (!(this.state[key] instanceof Date)) {
      throw new Error(`Attempted to replace ${key} with date.`);
    }
  }
}

export const state = new State();
