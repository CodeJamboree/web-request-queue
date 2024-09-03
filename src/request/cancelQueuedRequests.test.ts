import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { mockFn } from '../../scripts/utils/mockFn.js';
import { stdout } from '../../scripts/utils/stdout.js';

const url = new URL("https://localhost");

export const mainFlow = async () => {

  const timeoutDelay = 100;

  const mockCancel1 = mockFn();
  const mockCancel2 = mockFn();

  state.flag('isBlocked', false);
  state.setTimeout('queueTimeoutId', setTimeout(() => {
    console.log('queueTimeoutId - called')
  }, timeoutDelay));
  state.setTimeout('queueIntervalId', setInterval(() => {
    console.log('queueIntervalId - called')
  }, timeoutDelay));
  state.setTimeout('progressTimeoutId', setTimeout(() => {
    console.log('progressTimeoutId - called')
  }, timeoutDelay));
  state.setTimeout('progressIntervalId', setInterval(() => {
    console.log('progressIntervalId - called')
  }, timeoutDelay));
  state.append('queue', { args: [url] });
  state.append('queue', { args: [url], onCancel: mockCancel1 });
  state.append('queue', { args: [url], onCancel: mockCancel2 });

  cancelQueuedRequests();

  expect(state.flagged('isBlocked'), 'isBlocked').is(true);
  expect(state.getTimeout('queueTimeoutId'), 'queueTimeoutId').is(undefined);
  expect(state.getTimeout('queueIntervalId'), 'queueIntervalId').is(undefined);
  expect(state.getTimeout('progressTimeoutId'), 'progressTimeoutId').is(undefined);
  expect(state.getTimeout('progressIntervalId'), 'progressIntervalId').is(undefined);
  expect(state.count('queue'), 'queue').is(0);
  expect(mockCancel1.wasCalled()).is(true);
  expect(mockCancel2.wasCalled()).is(true);
  expect(mockCancel1.lastArgs()).equals(['All queued requests canceled.']);
  expect(mockCancel2.lastArgs()).equals(['All queued requests canceled.']);

  const promise = new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      expect(stdout.getBuffer()).equals([
        'Canceling 3 queued requests\n'
      ]);
      resolve();
    }, timeoutDelay + 4);
  });

  await promise;
}

export const withoutQueue = () => {

  expect(state.count('queue'), 'queue').is(0);

  cancelQueuedRequests();

  expect(state.flagged('isBlocked'), 'isBlocked').is(true);
  expect(state.count('queue'), 'queue').is(0);
  expect(stdout.getBuffer()).equals([]);
}

export const customReason = () => {
  const mockCancel1 = mockFn();
  state.append('queue', { args: [url], onCancel: mockCancel1 });
  const reason = 'My custom reason';
  cancelQueuedRequests(reason);
  expect(mockCancel1.lastArgs()).equals([reason]);
}