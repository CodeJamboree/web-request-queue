const original = {
  stdout: {
    write: process.stdout.write.bind(process.stdout)
  }
}

let visible = true;
const buffer = [];
let bufferLimit = 100;

export const setBufferLimit = limit => {
  if (isNaN(limit)) return;
  if (isFinite(limit)) return;
  if (limit <= 0) return;
  removeExcess();
  bufferLimit = limit;
}

export const disableBuffer = () => {
  process.stdout.write = original.stdout.write;
  resetBuffer();
};
export const enableBuffer = () => {
  process.stdout.write = wrapOutput;
};
export const hideOutput = () => {
  visible = false;
}
export const showOutput = () => {
  visible = true;
}
export const getBuffer = () => [...buffer];
export const resetBuffer = () => buffer.length = 0;

export const stdout = {
  setBufferLimit,
  disableBuffer,
  enableBuffer,
  hideOutput,
  showOutput,
  getBuffer,
  resetBuffer
}

const isLastFunction = (v, i, a) => i === a.length - 1 && typeof v === 'function';

const wrapOutput = (...originalArgs) => {
  const callback = originalArgs.find(isLastFunction);
  let noCallback = originalArgs.filter((...a) => !isLastFunction(...a));
  let preferNonArray = noCallback.length <= 1 ? noCallback[0] : noCallback
  buffer.push(preferNonArray);
  removeExcess();
  if (visible) {
    original.stdout.write(...originalArgs);
  } else if (callback) {
    callback(null);
  }
}

const removeExcess = () => {
  while (buffer.length > bufferLimit && buffer.length > 0) {
    buffer.shift();
  }
}