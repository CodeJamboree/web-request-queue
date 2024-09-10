import https from 'https';
import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';

const sample = async () => new Promise<void>((resolve, reject) => {

  const res = https.request('https://localhost', res => {

    let chunks: any[] = [];

    res.on('data', chunk => chunks.push(chunk));

    res.on('end', () => {

      let text = Buffer.concat(chunks).toString();

      console.log('Received', text);

      resolve();

    });

  });

  res.on('error', reject);

  res.end();

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

  logger.title('Sample: HTTPS');

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
