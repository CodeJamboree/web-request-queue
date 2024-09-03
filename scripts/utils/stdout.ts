const original = {
  stdout: {
    write: process.stdout.write.bind(process.stdout)
  }
}

type bufferItem = (Uint8Array | string) | [(Uint8Array | string), BufferEncoding | undefined];

let visible = true;
const buffer: bufferItem[] = [];
let bufferLimit = 100;

export const setBufferLimit = (limit: number) => {
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
export const getBuffer = (): bufferItem[] => [...buffer];
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


type cb = (err?: Error) => void;
interface wrapper {
  (buffer: Uint8Array | string, cb?: cb): boolean
  (str: Uint8Array | string, encoding?: BufferEncoding, cb?: cb): boolean
}
type writeArg = Uint8Array | string | cb | BufferEncoding | undefined
const isLastFunction = (
  v: writeArg,
  i: number,
  a: writeArg[]): boolean => i === a.length - 1 && typeof v === 'function';

const wrapOutput: wrapper = (...originalArgs: writeArg[]) => {
  const callback = originalArgs.find(isLastFunction) as cb;
  let noCallback = originalArgs.filter((...a) => !isLastFunction(...a));
  let preferNonArray = noCallback.length <= 1 ? noCallback[0] as Uint8Array : noCallback as [Uint8Array, BufferEncoding]
  buffer.push(preferNonArray);
  removeExcess();
  if (visible) {
    switch (originalArgs.length) {
      case 1:
        {
          const [buf] = originalArgs;
          return original.stdout.write(buf as Uint8Array);
        }
      case 2:
        {
          const [buf, cb] = originalArgs;
          return original.stdout.write(
            buf as Uint8Array | string,
            cb as cb
          )
        }
      case 3:
        {
          const [buf, encoding, cb] = originalArgs;
          return original.stdout.write(
            buf as Uint8Array | string,
            encoding as BufferEncoding,
            cb as cb
          )
        }
      default:
        return false;
    }
  } else if (callback) {
    callback();
    return true;
  }
  return false;
}

const removeExcess = () => {
  while (buffer.length > bufferLimit && buffer.length > 0) {
    buffer.shift();
  }
}