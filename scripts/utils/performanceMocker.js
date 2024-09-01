const original = {
  now: performance.now.bind(performance),
  hrtime: process.hrtime.bind(process)
};

const set = (ms) => {
  const customNow = () => {
    return ms;
  }
  performance.now = customNow;

  const seconds = Math.floor(ms / 1000);
  const ns = (ms - (seconds * 1000)) * 1000000;

  const customHrtime = (time) => {
    return time ? [seconds, ns] : [0, 0];
  }
  process.hrtime = customHrtime;
}
const freeze = () => {
  set(original.now());
}

const restore = () => {
  performance.now = original.now;
  process.hrtime = original.hrtime;
}

export const performanceMocker = {
  freeze,
  set,
  restore
}
