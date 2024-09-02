import { webRequest } from '../src/index.js';

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
    console.error('req.error');
    console.log(e);
  });
  req.end();
}

const url = new URL('https://github.com/CodeJamboree/');

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET'
}

webRequest.queue({
  args: [options, callback],
  onRequested,
  onCancel: (err) => {
    console.error('canceled', err);
  }
});

console.log('done'); // called before request is made
