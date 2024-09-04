import { webRequest } from '../src/index.js';
import { ClientRequest, IncomingMessage } from '../src/types.js';
import { __assign } from 'tslib';

const label = 'Queue';
console.time(label);
let interval = setInterval(() => {
  const { requested, queued } = webRequest.info();
  console.timeLog(label, 'Requested', requested, 'of', requested + queued);
}, 1000);

webRequest.configure({
  requestsPerPeriod: 1,
  secondsPerPeriod: 2
});

const handleRequest = async (req: ClientRequest) => new Promise<Buffer>((resolve, reject) => {
  let buffer: Buffer;
  const handleEnd = () => resolve(buffer);
  const handleResponse = (res: IncomingMessage) => {
    if (buffer) return;
    buffer = Buffer.alloc(0);
    res.on('error', reject);
    res.on('end', handleEnd);
    res.on('close', handleEnd);
    res.on('data', (data) => {
      buffer = Buffer.concat([buffer, data]);
    });
  }

  req.on('error', reject);
  req.on('timeout', () => reject('Request timed out'));
  req.on('abort', () => reject('Request aborted'));
  req.on('upgrade', handleResponse);
  req.on('response', handleResponse);
  req.on('connect', handleResponse);
  req.on('close', handleResponse);
  req.end();
});


const all: Promise<Buffer>[] = [];
for (let i = 0; i < 3; i++) {
  const queued = webRequest
    .queue(`https://github.com/CodeJamboree/?${i}`)
    ?.then(handleRequest);
  if (queued) all.push(queued);
}

Promise.all(all)
  .then(buffers => {
    console.log('Downloaded', buffers.length, 'pages');
    const bytes = buffers.reduce((sum, buffer) => sum + (buffer?.length ?? 0), 0);
    console.log(bytes, 'bytes total');
  })
  .catch(err => {
    console.error('Error', err);
  }).finally(() => {

    clearInterval(interval);
    console.timeEnd(label);

    console.log('done');
  });
