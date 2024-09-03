import { expect } from '../../scripts/utils/expect.js';
import { evalInterval, evalTimeout, queueInterval, queueTimeout, state, blocked, queue } from '../state.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { mockFn } from '../../scripts/utils/mockFn.js';
import { stdout } from '../../scripts/utils/stdout.js';

const url = new URL("https://localhost");

export const mainFlow = async () => {

  const timeoutDelay = 100;

  const mockCancel1 = mockFn();
  const mockCancel2 = mockFn();

  state.flag(blocked, false);
  state.startTimeout(queueTimeout, () => {
    console.log(queueTimeout, 'called')
  }, timeoutDelay);
  state.startInterval(queueInterval, () => {
    console.log(queueInterval, 'called')
  }, timeoutDelay);
  state.startTimeout(evalTimeout, () => {
    console.log(evalTimeout, 'called')
  }, timeoutDelay);
  state.startInterval(evalInterval, () => {
    console.log(evalInterval, 'called')
  }, timeoutDelay);
  state.append(queue, { args: [url] });
  state.append(queue, { args: [url], onCancel: mockCancel1 });
  state.append(queue, { args: [url], onCancel: mockCancel2 });

  cancelQueuedRequests();

  expect(state.flagged(blocked), blocked).is(true);
  expect(state.hasTimers(queueTimeout), queueTimeout).is(false);
  expect(state.hasTimers(queueInterval), queueInterval).is(false);
  expect(state.hasTimers(evalTimeout), evalTimeout).is(false);
  expect(state.hasTimers(evalInterval), evalInterval).is(false);
  expect(state.count(queue), queue).is(0);
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

  expect(state.count(queue), queue).is(0);

  cancelQueuedRequests();

  expect(state.flagged(blocked), blocked).is(true);
  expect(state.count(queue), queue).is(0);
  expect(stdout.getBuffer()).equals([]);
}

export const customReason = () => {
  const mockCancel1 = mockFn();
  state.append(queue, { args: [url], onCancel: mockCancel1 });
  const reason = 'My custom reason';
  cancelQueuedRequests(reason);
  expect(mockCancel1.lastArgs()).equals([reason]);
}