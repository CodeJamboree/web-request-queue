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

const url = new URL('https://github.com/CodeJamboree/');

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET'
}

webRequest.queue(options, callback).then(req => {
  req.on('error', (err) => console.error(err));
  req.end();
}).catch(err => {
  console.error('catch', err);
}).finally(() => {
  console.log('done');
});
