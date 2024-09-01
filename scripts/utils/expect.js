import { ExpectationError } from './ExpectationError.js';

export const expect = (actualValue, details) => {
  const serialize = value => JSON.stringify(value, (key, value) => {
    if (value instanceof Error) return value.message;
    if (typeof value === 'function') {
      let name = value.name;
      if ((name ?? '') === '') return '{function}';
      return `{${name}}`;
    }
    return value;
  }, '  ');
  return ({
    equals: expectedValue => {
      const actual = serialize(actualValue);
      const expected = serialize(expectedValue);
      if (actual !== expected) {
        throw new ExpectationError(`Expected equal`, { details, expectedValue, actualValue });
      }
    },
    isFunction: () => {
      if (typeof actualValue === 'function') return;
      throw new ExpectationError(`Expected function`, { details, actualValue });
    },
    is: expectedValue => {
      if (actualValue === expectedValue) return;
      throw new ExpectationError(`Expected same`, { details, expectedValue, actualValue });
    },
    lengthOf: expectedValue => {
      if (actualValue.length === expectedValue) return;
      throw new ExpectationError(`Expected same length`, { details, expectedValue, actualValue });
    },
    startsWith: expectedValue => {
      if (actualValue.startsWith(expectedValue)) return;
      throw new ExpectationError(`Expected beginning`, { details, expectedValue, actualValue });
    },
    includes: expectedValue => {
      if (actualValue.includes(expectedValue)) return;
      throw new ExpectationError(`Expected to include`, { details, expectedValue, actualValue });
    },
    endsWith: expectedValue => {
      if (actualValue.endsWith(expectedValue)) return;
      throw new ExpectationError(`Expected ending`, { details, expectedValue, actualValue });
    },
    toThrow: error => {
      let thrown = true;
      try {
        actualValue();
        thrown = false;
      } catch (e) {
        expect(e, details).equals(error);
      }
      if (!thrown)
        throw new ExpectationError(`Expected to throw`, { details, error, actualValue })
    }
  })
}