import { ExpectationError } from './ExpectationError.js';
import { serialize } from './serialize.js';

export const expect = (actual: any, details?: any) => {

  return ({
    equals: (expected: any) => {
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
    is: (expected: any) => {
      if (actual === expected) return;
      throw new ExpectationError(`same`, { details, expected, actual });
    },
    lengthOf: (expected: number) => {
      if (actual.length === expected) return;
      throw new ExpectationError(`length`, { details, expected, actual });
    },
    startsWith: (expected: string) => {
      if (actual.startsWith(expected)) return;
      throw new ExpectationError(`beginning`, { details, expected, actual });
    },
    includes: (expected: any) => {
      if (actual.includes(expected)) return;
      throw new ExpectationError(`including`, { details, expected, actual });
    },
    endsWith: (expected: string) => {
      if (actual.endsWith(expected)) return;
      throw new ExpectationError(`ending`, { details, expected, actual });
    },
    toThrow: (error?: Error | string) => {
      let thrown = true;
      try {
        actual();
        thrown = false;
      } catch (e) {
        thrown = true;
        if (typeof error !== 'undefined') {
          expect(e, details).equals(error);
        }
      }
      if (!thrown)
        throw new ExpectationError(`throws`, { details, error, actual })
    },
    instanceOf: (expected: any | Function | string) => {
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