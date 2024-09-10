import { webRequest } from '../src/index.js';
import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';

const sample = async () => new Promise<void>((resolve, reject) => {

  webRequest.queue('https://localhost', res => {

    let chunks: any[] = [];

    res.on('data', chunk => chunks.push(chunk));

    res.on('error', reject);

    res.on('end', () => {

      let text = Buffer.concat(chunks).toString();

      console.log('Received', text);

      resolve();

    });
  }).then(req => {
    req.on('error', reject);
    req.end();
  });
});

const setup = () => {
  httpUtils.mock();
  httpUtils.setResponseData(JSON.stringify({ foo: "bar" }))
}

const teardown = () => {
  httpUtils.restore();
}

try {
  logger.attach();

  logger.title('Sample: Queue with promise');

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
