import https from 'https';

const url = new URL('https://github.com/CodeJamboree/')
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'GET'
}
const res = https.request(options, (res) => {
  let total = 0;
  console.log('Status', res.statusCode, res.statusMessage);

  res.on('data', data => {
    total += data.length;
  });
  res.on('end', () => {
    console.log('Recevied', total, 'bytes');
  });
});

res.on('error', (e) => {
  console.error('Error');
  console.log(e);
});

res.end();