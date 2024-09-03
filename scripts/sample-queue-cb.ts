import { webRequest } from '../src/index.js';
import { ClientRequest, IncomingMessage, RequestOptions } from '../src/types.js';

const callback = (res: IncomingMessage) => {
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
const onRequested = (req: ClientRequest) => {
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

webRequest.queue({
  args: [options, callback],
  onRequested,
  onCancel: (err: Error) => {
    console.error('canceled', err);
  }
});

console.log('done'); // called before request is made
