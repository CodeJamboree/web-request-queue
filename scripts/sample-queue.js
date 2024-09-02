import { webRequest } from '../src/index.js';
import whyIsNodeRunning from 'why-is-node-running';

const callback = (res) => {
  let total = 0;
  console.log('Status', res.statusCode, res.statusMessage);

  res.on('data', data => {
    total += data.length;
  });
  res.on('end', () => {
    console.log(total, 'bytes');
  });
}
const onRequested = req => {
  req.on('error', e => {
    console.error('onRequested.error');
    console.log(e);
  });
  req.end();
}

const url = new URL('https://github.com/CodeJamboree/')
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET'
}
webRequest.queue({
  args: [options, callback],
  onRequested,
  onCancel: (err) => {
    console.error('onCancel', err);
  }
});

console.timeEnd('Web Requests');
console.log('done');

// setTimeout(() => {
//   console.log(process._getActiveHandles().map(m => m?._type));
//   console.log(process._getActiveRequests());
// }, 5000);
