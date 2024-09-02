const isDate = value => value instanceof Date;
const isTimeout = value => {
  const type = typeof value;
  switch (type) {
    case 'object':
      return value?.constructor?.name === 'Timeout';
    case 'number':
      return true;
    default:
      return false;
  }
}

const initialState = {
  lastAt: isDate,
  firstAt: isDate,
  progressedAt: isDate,

  isBlocked: false,

  queue: [],

  progressIntervalId: isTimeout,
  progressTimeoutId: isTimeout,
  queueIntervalId: isTimeout,
  queueTimeoutId: isTimeout,

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
    if (typeof value === 'function') return;
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
    if (typeof original !== 'function') {
      throw new Error(`Unable to remove ${key}`);
    }
    this.state[key] = initialState[key];
  }
  reset() {
    // clear timeout/interval first?
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
      if (valueType === 'object' && keyType === 'function') {
        if (!originalKeyValue(value)) {
          throw new Error(`Unable to set ${key} as ${value?.constructor?.name ?? valueType}. Expected ${originalKeyValue.name}.`);
        }
      } else {
        throw new Error(`Unable to set ${key} as ${valueType}. Expected ${keyType}.`);
      }
    }

    if (Array.isArray(originalKeyValue)) {
      throw new `Unable to set ${key} directly. Use append, prepend, removeAll, removeFirst`;
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
