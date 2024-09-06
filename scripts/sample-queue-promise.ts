import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');

const options = {
  hostname: url.hostname,
  path: url.pathname,
  headers: {
    'user-agent': '@CodeJamboree/Web-Request-Queue'
  }
}

webRequest.queue(options, res => {
  let total = 0;
  console.log('Status', res.statusCode, res.statusMessage);
  res.on('data', data => total += data.length);
  res.on('end', () => console.log(total, 'bytes'));
  res.on('error', err => console.error(err));
})
  .then(req => {
    req.on('error', err => console.error(err));
    req.end();
  })
  .catch(err => console.error(err))
  .finally(() => console.log('done'));
