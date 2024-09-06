import { webRequest } from '../src/index.js';

let interval = setInterval(() => {
  const { requested, queued } = webRequest.info();
  console.log('Requested', requested, 'of', requested + queued);
}, 1000);

webRequest.configure({
  requestsPerPeriod: 1,
  secondsPerPeriod: 2
});

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');

const options = { headers: { 'user-agent': '@CodeJamboree/Web-Request-Queue' } };

const all: Promise<Buffer>[] = [];
for (let i = 0; i < 3; i++) {
  const queued = webRequest
    .queue(url, options)
    .then(req => new Promise<Buffer>((resolve, reject) => {
      req.on('error', reject);
      req.on('response', (res) => {
        let buffers: Buffer[] = [];
        res.on('error', reject);
        res.on('end', () => resolve(Buffer.concat(buffers)));
        res.on('data', data => buffers.push(data));
      });
      req.end();
    }));
  all.push(queued);
}

Promise.all(all)
  .then(buffers => {
    console.log(buffers.length, 'requests');
    const bytes = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
    console.log(bytes, 'bytes total');
  })
  .catch(err => console.error(err))
  .finally(() => {
    clearInterval(interval);
    console.log('done');
  });
