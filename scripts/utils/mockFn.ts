export class MockedFunctionError extends Error {
  toString() {
    return `${this.constructor.name}: ${this.message}`;
  }
}
export const mockFn = (fn?: Function) => {
  const calls: any[][] = [];
  let returnValue: any;

  const callback = (...args: any[]) => {
    calls.push(args);
    let fnReturn;
    if (typeof fn === 'function') {
      fnReturn = fn(...args);
    }
    return returnValue ?? fnReturn;
  }
  callback.wasCalled = () => calls.length !== 0;
  callback.callCount = () => calls.length;
  callback.lastCall = () => {
    if (calls.length === 0) {
      throw new MockedFunctionError('Not called');
    }
    return calls[calls.length - 1];
  }
  callback.lastCallArg = (index: number = 0): any => {
    const args = callback.lastCall();
    if (index >= args.length) {
      throw new MockedFunctionError(`Arg index ${index} not found. Only have ${args.length}`);
    }
    return args[index];
  }
  callback.lastCallFirstArg = () => {
    const args = callback.lastCall();
    if (args.length === 0) {
      throw new MockedFunctionError('No Argments');
    }
  }
  callback.callAt = (i: number) => {
    if (calls.length === 0) {
      throw new MockedFunctionError('Not called');
    } else if (i >= calls.length) {
      throw new MockedFunctionError(`Call index ${i} not found. Only have ${calls.length}.`);
    }
    return calls[i];
  }
  callback.returns = (value: any) => returnValue = value;

  return callback;
}