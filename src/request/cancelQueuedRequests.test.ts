import { expect, mockFunction } from '@codejamboree/js-test';
import { queueInterval, queueTimeout, state, blocked, queue } from '../state.js';
import { cancelQueuedRequests } from './cancelQueuedRequests.js';

const url = new URL("https://localhost");

export const mainFlow = () => {

  const timeoutDelay = 100;

  const mockCancel1 = mockFunction();
  const mockCancel2 = mockFunction();

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
  expect(mockCancel1.called(), 'cancel1').is(true);
  expect(mockCancel2.called(), 'cancel2').is(true);

  expect(mockCancel1.callAt(-1), 'cancel1').equals([]);
  expect(mockCancel1.callAt(-1), 'cancel2').equals([]);
}

export const withoutQueue = () => {

  expect(state.count(queue), queue).is(0);

  cancelQueuedRequests();

  expect(state.flagged(blocked), blocked).is(false);
  expect(state.count(queue), queue).is(0);
}

export const customReason = () => {
  const mockCancel1 = mockFunction();
  state.append(queue, { args: [url], onCancel: mockCancel1 });
  const reason = 'My custom reason';
  cancelQueuedRequests(reason);
  expect(mockCancel1.callArg(-1, 0)).is(reason);
}