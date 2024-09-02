let started = false;

const label = 'Web Requests';

const start = () => {
  if (started) return;
  console.time(label);
  started = true;
}
const log = (...data: any[]) => {
  if (!started) start();
  console.timeLog(label, ...data);
}
const stop = () => {
  if (!started) return;
  console.timeEnd(label);
  started = false;
}
const hasStarted = () => {
  return started;
}
export const timeLogger = {
  start,
  log,
  stop,
  hasStarted
};
