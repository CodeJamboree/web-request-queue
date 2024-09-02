import { ExpectationError } from './ExpectationError.js';
import { serialize } from './serialize.js';

export const expect = (actual, details) => {

  return ({
    equals: expected => {
      const a = serialize(actual);
      const e = serialize(expected);
      if (a !== e) {
        throw new ExpectationError(`equal`, { details, expected, actual });
      }
    },
    isFunction: () => {
      if (typeof actual === 'function') return;
      throw new ExpectationError(`function`, { details, actual });
    },
    is: expected => {
      if (actual === expected) return;
      throw new ExpectationError(`same`, { details, expected, actual });
    },
    lengthOf: expected => {
      if (actual.length === expected) return;
      throw new ExpectationError(`length`, { details, expected, actual });
    },
    startsWith: expected => {
      if (actual.startsWith(expected)) return;
      throw new ExpectationError(`beginning`, { details, expected, actual });
    },
    includes: expected => {
      if (actual.includes(expected)) return;
      throw new ExpectationError(`including`, { details, expected, actual });
    },
    endsWith: expected => {
      if (actual.endsWith(expected)) return;
      throw new ExpectationError(`ending`, { details, expected, actual });
    },
    toThrow: error => {
      let thrown = true;
      try {
        actual();
        thrown = false;
      } catch (e) {
        expect(e, details).equals(error);
      }
      if (!thrown)
        throw new ExpectationError(`throws`, { details, error, actual })
    },
    instanceOf: expected => {
      if (typeof actual !== 'object') {
        throw new ExpectationError('instanceOf', {
          details,
          expected,
          actual: typeof actual
        });
      }
      if (typeof expected === 'string') {
        const name = actual?.constructor?.name;
        if (name !== expected) {
          throw new ExpectationError('instanceOf', {
            details,
            expected,
            actual: name
          });
        }
        return;
      }
      if (!(actual instanceof expected)) {
        throw new ExpectationError('instanceOf', {
          details,
          expected,
          actual
        });
      }
    }
  })
}