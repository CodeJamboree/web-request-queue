import { webRequest } from '../src/index.js';
import { requestCallback, RequestOptions, responseCallback } from '../src/global.js';

const callback: responseCallback = res => {
  let total = 0;
  console.log('Status', res.statusCode, res.statusMessage);

  res.on('data', data => {
    if (typeof data === 'object' && 'length' in data)
      total += data.length;
  });
  res.on('end', () => {
    console.log(total, 'bytes');
  });
  res.on('error', err => {
    console.error('Response Error', err);
  });
}
const onRequested: requestCallback = req => {
  req.on('error', (e) => {
    console.error('Request Error', e);
  });
  req.end();
}

const url = new URL('https://github.com/CodeJamboree/');

const options: RequestOptions = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET'
}

webRequest.queueSync({
  args: [options, callback],
  onRequested,
  onCancel: (err: Error) => {
    console.error('canceled', err);
  }
});

console.log('done'); // called before request is made
