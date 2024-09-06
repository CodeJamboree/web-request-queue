import https from 'https';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');
const options = {
  hostname: url.hostname,
  path: url.pathname,
  headers: {
    'user-agent': '@CodeJamboree/Web-Request-Queue'
  }
};

const res = https.request(options, res => {
  let total = 0;
  console.log('Status', res.statusCode, res.statusMessage);
  res.on('data', data => total += data.length);
  res.on('end', () => console.log(total, 'bytes'));
});
res.on('error', err => console.log(err));
res.end();