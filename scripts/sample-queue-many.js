import { webRequest } from '../src/index.js';

// Show progress once per second
webRequest.setEvaluationSeconds(1);

// Make only 1 request every 2 seconds
webRequest.setRequestsPerPeriod(1);
webRequest.setSecondsPerPeriod(2);

const handleRequest = async req => new Promise((resolve, reject) => {
  let buffer;
  const handleEnd = () => resolve(buffer);
  const handleResponse = res => {
    if (buffer) return;
    buffer = Buffer.alloc(0);
    res.on('error', reject);
    res.on('end', handleEnd);
    res.on('close', handleEnd);
    res.on('aborted', () => reject('Response aborted'));
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


const all = [];
for (let i = 0; i < 3; i++) {
  const queued = webRequest
    .queue(`https://github.com/CodeJamboree/?${i}`)
    .then(handleRequest);
  all.push(queued);
}

Promise.all(all)
  .then(buffers => {
    console.log('Downloaded', buffers.length, 'pages');
    const bytes = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
    console.log(bytes, 'bytes total');
  })
  .catch(err => {
    console.error('Error', err);
  }).finally(() => {
    console.log('done');
  });
