import { expect } from '../../scripts/utils/expect.js';
import { queueInterval, queueTimeout, state, blocked, queue } from '../state.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';
import { mockFn } from '../../scripts/utils/mockFn.js';

const url = new URL("https://localhost");

export const mainFlow = () => {

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
  state.append(queue, { args: [url] });
  state.append(queue, { args: [url], onCancel: mockCancel1 });
  state.append(queue, { args: [url], onCancel: mockCancel2 });

  cancelQueuedRequests();

  expect(state.flagged(blocked), blocked).is(false);
  expect(state.hasTimers(queueTimeout), queueTimeout).is(false);
  expect(state.hasTimers(queueInterval), queueInterval).is(false);
  expect(state.count(queue), queue).is(0);
  expect(mockCancel1.lastCall(), 'cancel1').equals([]);
  expect(mockCancel2.lastCall(), 'cancel2').equals([]);
}

export const withoutQueue = () => {

  expect(state.count(queue), queue).is(0);

  cancelQueuedRequests();

  expect(state.flagged(blocked), blocked).is(false);
  expect(state.count(queue), queue).is(0);
}

export const customReason = () => {
  const mockCancel1 = mockFn();
  state.append(queue, { args: [url], onCancel: mockCancel1 });
  const reason = 'My custom reason';
  cancelQueuedRequests(reason);
  expect(mockCancel1.lastCallArg()).is(reason);
}