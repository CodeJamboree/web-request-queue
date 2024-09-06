import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');
const options = { headers: { 'user-agent': '@CodeJamboree/Web-Request-Queue' } };

webRequest.toStream(process.stdout, url, options)
  .then(stream => stream.end())
  .catch(err => console.error(err))
  .finally(() => console.log('done'));
