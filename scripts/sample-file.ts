import fs from 'fs';
import os from 'os';
import path from 'path';
import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';
import { webRequest } from '../src/index.js';

const sample = async () => {
  const timestamp = Date.now();
  const filePath = path.join(
    os.tmpdir(),
    `temp-${timestamp}.json`
  );
  await webRequest.toFile(filePath, 'https://localhost')
    .then(() => {
      console.log('Got file', filePath);
      console.log(fs.statSync(filePath).size, 'bytes');
    });
}

const setup = () => {
  httpUtils.mock();
  httpUtils.setResponseData(JSON.stringify({ foo: "bar" }))
}

const teardown = () => {
  httpUtils.restore();
}

try {
  logger.attach();

  logger.title('Sample: File');

  setup();
  sample()
    .catch(logger.logError)
    .finally(() => {
      teardown();
      logger.done()
    });
} catch (e) {
  teardown();
  logger.logError(e);
  logger.done();
}
