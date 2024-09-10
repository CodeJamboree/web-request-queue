import { logger } from '@codejamboree/js-logger';
import { webRequest } from '../src/index.js';
import { httpUtils } from '@codejamboree/js-test';

interface Account {
  name: string,
  created_at: string | Date
}

const sample = async () => {

  const url = 'https://localhost';

  await Promise.all([
    webRequest.parseJson<Account>(url),
    webRequest.parseJsonWithReviver<Account>(revivor, url)
  ]).then(users => {
    users.forEach(user => {
      console.group(user.name);
      console.log('Created', user.created_at, typeof user.created_at);
      console.groupEnd();
    });
  })
}

const revivor = (key: string, value: any) => {
  if (key.endsWith('_at')) return new Date(value);
  return value;
}

const setup = () => {
  httpUtils.mock();
  const account: Account = {
    name: 'Lewis Moten',
    created_at: "2024-09-09T17:24:06.311Z"
  };
  httpUtils.setResponseData(JSON.stringify(account));
}

const teardown = () => {
  httpUtils.restore();
}

try {
  logger.attach();

  logger.title('Sample: JSON');

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