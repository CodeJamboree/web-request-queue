import { expect } from '../../utils/expect.js';
import { state } from '../../../src/state.js';
import { cancelQueuedRequests } from '../../../src/request/cancelQueuedRequests.js';
import { mockFn } from '../../utils/mockFn.js';
import { stdout } from '../../utils/stdout.js';

export const name = 'cancelQueuedRequests';

export const cancelQueuedRequestsTest = async () => {

  const timeoutDelay = 100;

  const mockCancel1 = mockFn();
  const mockCancel2 = mockFn();

  state.set('isBlocked', false);
  state.set('queueTimeoutId', setTimeout(() => {
    console.log('queueTimeoutId - called')
  }, timeoutDelay));
  state.set('queueIntervalId', setInterval(() => {
    console.log('queueIntervalId - called')
  }, timeoutDelay));
  state.set('progressTimeoutId', setTimeout(() => {
    console.log('progressTimeoutId - called')
  }, timeoutDelay));
  state.set('progressIntervalId', setInterval(() => {
    console.log('progressIntervalId - called')
  }, timeoutDelay));
  state.append('queue', 5);
  state.append('queue', { onCancel: mockCancel1 });
  state.append('queue', { onCancel: mockCancel2 });

  cancelQueuedRequests();

  expect(state.get('isBlocked'), 'isBlocked').is(true);
  expect(state.get('queueTimeoutId'), 'queueTimeoutId').is(undefined);
  expect(state.get('queueIntervalId'), 'queueIntervalId').is(undefined);
  expect(state.get('progressTimeoutId'), 'progressTimeoutId').is(undefined);
  expect(state.get('progressIntervalId'), 'progressIntervalId').is(undefined);
  expect(state.count('queue'), 'queue').is(0);
  expect(mockCancel1.wasCalled()).is(true);
  expect(mockCancel2.wasCalled()).is(true);
  expect(mockCancel1.lastArgs()).equals(['All queued requests canceled.']);
  expect(mockCancel2.lastArgs()).equals(['All queued requests canceled.']);

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(stdout.getBuffer()).equals([
        'Canceling 3 queued requests\n'
      ]);
      resolve();
    }, timeoutDelay + 4);
  });

  await promise;
}

export const cancelQueuedRequestsWithoutQueueTest = () => {

  expect(state.count('queue'), 'queue').is(0);

  cancelQueuedRequests();

  expect(state.get('isBlocked'), 'isBlocked').is(true);
  expect(state.count('queue'), 'queue').is(0);
  expect(stdout.getBuffer()).equals([]);
}

export const cancelQueuedRequestsWithCustomReason = () => {
  const mockCancel1 = mockFn();
  state.append('queue', { onCancel: mockCancel1 });
  const reason = 'My custom reason';
  cancelQueuedRequests(reason);
  expect(mockCancel1.lastArgs()).equals([reason]);
}