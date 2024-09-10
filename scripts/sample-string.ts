import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';
import { webRequest } from '../src/index.js';

const sample = async () =>
  webRequest.asString('https://localhost')
    .then(text => console.log('Received', text));

const setup = () => {
  httpUtils.mock();
  httpUtils.setResponseData(JSON.stringify({ foo: "bar" }))
}

const teardown = () => {
  httpUtils.restore();
}

try {
  logger.attach();

  logger.title('Sample: String');

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
