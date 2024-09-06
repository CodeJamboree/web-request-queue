import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');

const options = {
  hostname: url.hostname,
  path: url.pathname,
  headers: {
    'user-agent': '@CodeJamboree/Web-Request-Queue'
  }
}

webRequest.queueWithCallbacks({
  args: [options, res => {
    let total = 0;
    console.log('Status', res.statusCode, res.statusMessage);
    res.on('data', data => total += (data as Buffer).length);
    res.on('end', () => console.log(total, 'bytes'));
    res.on('error', err => console.error(err));
  }],
  onRequested: req => {
    req.on('error', err => console.error(err));
    req.end();
  },
  onCancel: err => console.error(err)
});

console.log('done'); // called before request is made
