
import { PassThrough } from 'stream';
import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';
import { webRequest } from '../src/index.js';

const sample = () => new Promise<void>((resolve) => {
  const chunks: any[] = [];
  const stream = new PassThrough();
  stream.on('data', chunk => chunks.push(chunk));
  webRequest.toStream(stream, 'https://localhost')
    .then(stream => {
      let text = Buffer.concat(chunks).toString();
      console.log('Received', text);
      resolve();
    });
})

const setup = () => {
  httpUtils.mock();
  httpUtils.setResponseData(JSON.stringify({ foo: "bar" }))
}

const teardown = () => {
  httpUtils.restore();
}

try {
  logger.attach();

  logger.title('Sample: Stream');

  setup();
  sample()
    .catch(e => {
      console.error(e);
      logger.logError(e);
    })
    .finally(() => {
      console.log('finally');
      teardown();
      logger.done()
    });
} catch (e) {
  console.log('catch', e);
  teardown();
  logger.logError(e);
  logger.done();
}
