const timeoutKeys = [
  'progressIntervalId',
  'progressTimeoutId',
  'queueIntervalId',
  'queueTimeoutId'
];
const dateKeys = [
  'lastAt',
  'firstAt',
  'progressedAt'
]
const removableKeys = [
  ...timeoutKeys,
  ...dateKeys
]
const initialState = {
  lastAt: undefined,
  firstAt: undefined,
  progressedAt: undefined,

  isBlocked: false,

  queue: [],

  progressIntervalId: undefined,
  progressTimeoutId: undefined,
  queueIntervalId: undefined,
  queueTimeoutId: undefined,

  requestCount: 0,
  expectedCount: 1,
  priorRemainingCount: 0,
  priorPresumedTotal: 0,
  throttleCount: 100,
  throttleSeconds: 60,
  progressSeconds: Infinity
};

class State {
  state = {};

  constructor() {
    this.reset();
  }
  get(key) {
    this.ensureNotArray(key);
    const value = this.state[key];
    return value;
  }
  set(key, value) {
    this.ensureNotArray(key);
    this.ensureType(key, value);
    if (timeoutKeys.includes(key)) console.log('set', key, `${value}`);
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
    if (!removableKeys.includes(key)) {
      throw new Error(`Unable to remove ${key}`);
    }

    if (timeoutKeys.includes(key)) {
      const value = this.state[key];
      if (!value._destroyed) {
        throw new Error(`Unable to remove ${key}. Timeout not yet destroyed.`);
      }
      console.log('remove', key);
    }
    this.state[key] = undefined;
  }
  reset() {
    timeoutKeys.forEach((key) => {
      const value = this.state[key];
      if (value === undefined) return;
      if (!value._destroyed) {
        throw new Error(`Unable to remove ${key}. Timeout not yet destroyed.`);
      }
    });
    const keys = Object.keys(initialState);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (Array.isArray(initialState[key])) {
        this.state[key] = [];
      } else {
        this.state[key] = initialState[key];
      }
    };
  }
  ensureType(key, value) {
    this.ensureKeyExists(key);
    const valueType = typeof value;
    const originalKeyValue = initialState[key];
    const keyType = typeof originalKeyValue;
    if (valueType !== keyType) {
      if (valueType === 'object' && removableKeys.includes(key)) {
        if (timeoutKeys.includes(key)) {
          if (value?.constructor?.name !== 'Timeout') {
            throw new Error(`Unable to set ${key} as ${value?.constructor?.name ?? valueType}. Expected Timeout.`);
          }
          if (this.state[key] !== undefined) {
            throw new Error('Attempted to replace existing Timeout');
          }
        }
        if (dateKeys.includes(key) && !(value instanceof Date)) {
          throw new Error(`Unable to set ${key} as ${value?.constructor?.name ?? valueType}. Expected Date.`);
        }
      } else {
        throw new Error(`Unable to set ${key} as ${valueType}. Expected ${keyType}.`);
      }
    }

    if (Array.isArray(originalKeyValue)) {
      throw new `Unable to set ${key} directly. Use append, prepend, removeAll, removeFirst`;
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
