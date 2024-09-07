import { run } from '@codejamboree/js-test';
try {
  console.info('Test')
  run({
    folderPath: 'build/src',
    testFilePattern: /([xf]_)?(.*)\.test\.js$/,
    testFileReplacement: '$2'
  })
    .catch(e => console.error(e))
    .finally(() => {
      console.info('done');
    });
} catch (e) {
  console.error(e);
  console.info('done');
}
