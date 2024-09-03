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
  callback.lastArgs = () => calls.length === 0 ? void 0 : calls[calls.length - 1];
  callback.callAt = (i: number) => calls[i];
  callback.returns = (value: any) => returnValue = value;

  return callback;
}