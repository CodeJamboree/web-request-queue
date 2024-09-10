import { run } from '@codejamboree/js-test';
import { logger } from '@codejamboree/js-logger';

try {
  logger.attach();
  logger.title('Test');
  run({
    folderPath: 'build/src',
    testFilePattern: /([xf]_)?(.*)\.test\.js$/,
    testFileReplacement: '$2',
    timeoutMs: 100,
    failFast: true,
    randomOrder: true
  })
    .catch(logger.logError)
    .finally(logger.done);
} catch (e) {
  logger.logError(e);
  logger.done();
}
