import { ExpectationError } from './ExpectationError.js';
import { serialize } from './serialize.js';

export const expect = <T>(actual: T, details?: any) => {

  return ({
    equals: (expected: T) => {
      const a = serialize(actual);
      const e = serialize(expected);
      if (a !== e) {
        throw new ExpectationError(`equal`, { details, expected: e, actual: a });
      }
    },
    isFunction: () => {
      if (typeof actual === 'function') return;
      throw new ExpectationError(`function`, { details, actual });
    },
    is: (expected: T) => {
      if (actual === expected) return;
      throw new ExpectationError(`same`, { details, expected, actual });
    },
    lengthOf: (expected: number) => {
      let length: undefined | number = undefined;
      switch (typeof actual) {
        case 'object':
          if (actual !== null && ('length' in actual)) length = actual?.length as number;
          break;
        case 'function':
          if ('length' in actual) length = actual?.length;
          break;
        case 'string':
          length = actual.length;
          break;
        case 'undefined':
        case 'number':
        case 'boolean':
        default:
          break;
      }
      if (length !== expected) {
        throw new ExpectationError(`length`, { details, expected, actual });
      }
    },
    startsWith: (expected: string) => {
      if (typeof actual !== 'string' || !actual.startsWith(expected))
        throw new ExpectationError(`starts with`, { details, expected, actual });
    },
    includes: (expected: any) => {
      if (!(typeof actual === 'string' || Array.isArray(actual)) || !actual.includes(expected))
        throw new ExpectationError(`including`, { details, expected, actual });
    },
    endsWith: (expected: string) => {
      if (typeof actual !== 'string' || !actual.endsWith(expected))
        throw new ExpectationError(`ends with`, { details, expected, actual });
    },
    toThrow: (error?: Error | string) => {
      if (typeof actual !== 'function')
        throw new ExpectationError(`throws (non-function)`, { details, error, actual })

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