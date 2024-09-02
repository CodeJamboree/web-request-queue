export const mockFn = (fn) => {
  const calls = [];
  let returnValue;

  const callback = (...args) => {
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
  callback.callAt = (i) => calls[i];
  callback.returns = value => returnValue = value;

  return callback;
}