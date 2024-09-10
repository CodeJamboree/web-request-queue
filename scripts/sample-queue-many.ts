import { webRequest } from '../src/index.js';
import { logger } from '@codejamboree/js-logger';
import { httpUtils } from '@codejamboree/js-test';

const sample = async () => new Promise<void>((resolve, reject) => {

  const timeLabel = 'Time...';

  webRequest.configure({
    requestsPerPeriod: 1,
    secondsPerPeriod: 1
  });
  const queue: Promise<string>[] = [];

  console.log('queing requests');
  console.time(timeLabel);
  for (let i = 0; i < 10; i++) {
    queue.push(webRequest.queue('https://localhost')
      .then(req => new Promise<string>((resolve, reject) => {
        req.on('error', reject);
        req.on('response', res => {

          let chunks: any[] = [];

          res.on('data', chunk => chunks.push(chunk));

          res.on('error', reject);

          res.on('end', () => {
            console.timeLog(timeLabel, 'Response', i);
            let text = Buffer.concat(chunks).toString();
            resolve(text);
          });
        });
        req.end();
      })));
  };
  console.log('waiting to resolve requests');
  return Promise.all(queue).then((responses: string[]) => {
    console.log('Requests complete');
    console.log(responses);
  })

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

  logger.title('Sample: Queue with multiple promises');

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
