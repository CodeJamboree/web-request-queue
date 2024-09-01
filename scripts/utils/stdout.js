const log = process.stdout.write.bind(process.stdout);

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
  process.stdout.write = log;
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

const wrapOutput = (...args) => {
  buffer.push(args);
  removeExcess();
  if (visible) {
    log(...args);
  }
}

const removeExcess = () => {
  while (buffer.length > bufferLimit && buffer.length > 0) {
    buffer.shift();
  }
}