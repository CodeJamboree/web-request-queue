import fs from 'fs';
import os from 'os';
import path from 'path';
import { webRequest } from '../src/index.js';

const url = new URL('https://api.github.com/repos/CodeJamboree/web-request-queue');
const options = { headers: { 'user-agent': '@CodeJamboree/Web-Request-Queue' } };

const temp = path.join(os.tmpdir(), `temp-${Date.now()}.json`);

webRequest.toFile(temp, url, options)
  .then(() => {
    console.log('Got file', temp);
    console.log(fs.statSync(temp).size, 'bytes');
  })
  .catch(err => console.error(err))
  .finally(() => console.log('done'));
