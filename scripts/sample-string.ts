import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');
const options = { headers: { 'user-agent': '@CodeJamboree/Web-Request-Queue' } };

webRequest.asString(url, options)
  .then(text => console.log(text))
  .catch(err => console.error(err))
  .finally(() => console.log('done'));
