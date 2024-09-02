import { webRequest } from '../src/index.js';

const main = async () => {
  const bytes = await doRequest();
  console.log(bytes, 'bytes');
}
const doRequest = () => {
  return new Promise((resolve, reject) => {

    const callback = (res) => {
      let total = 0;
      console.log('Status', res.statusCode, res.statusMessage);

      res.on('data', data => {
        total += data.length;
      });
      res.on('end', () => {
        resolve(total);
      });
    }
    const onRequested = req => {
      req.on('error', reject);
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
      onCancel: reject
    });
  });

}
try {
  main().catch((e) => {
    console.error(e);
  }).finally(() => {
    console.log('done');
  });
} catch (e) {
  console.error(e);
  console.log('done');
}
// Hanging?
// timer/intervals
// unresolved promises
// db connections
// open files