import { handleResponseEnd } from "./handleResponseEnd.js";
import { mockFn } from '../../scripts/utils/mockFn.js';
import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';


// export const handleResponseEnd = (response, onCancel) => () => {
//   const { statusCode = 200, statusMessage } = response;
//   if (statusCode === 200) return;
//   const reason = `Unexpected Status ${statusCode}: ${statusMessage}`;
//   try {
//     if (typeof onCancel === 'function') {
//       return onCancel(reason);
//     } else {
//       throw new Error(reason);
//     }
//   } catch (e) {
//     cancelQueuedRequests(`A prior request ended with: ${reason}`);
//     throw e;
//   }
// }

export const ok = () => {
  const response = {
    statusCode: 200,
    statusMessage: 'OK'
  };
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const created = () => {
  const response = {
    statusCode: 201,
    statusMessage: 'Created'
  };
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const notFound = () => {
  const response = {
    statusCode: 404,
    statusMessage: 'Not Found'
  };
  const onCancel = undefined;
  handleResponseEnd(response, onCancel)();
}
export const badResponseInvokesCancel = () => {
  const response = {
    statusCode: 429,
    statusMessage: 'Too Many Requests'
  };
  const onCancel = mockFn();
  handleResponseEnd(response, onCancel)();
  expect(onCancel.lastArgs()).equals(['Unexpected Status 429: Too Many Requests'])
}

export const badResponseCancelsQueue = () => {
  const onCancel = mockFn();
  const onQueuedCancel = mockFn();
  state.append('queue', { onCancel: onQueuedCancel });

  const response = {
    statusCode: 401,
    statusMessage: 'Unauthorized'
  };
  handleResponseEnd(response, onCancel)();

  expect(state.count('queue'), 'queue.count').is(0);
  expect(onCancel.lastArgs(), 'onCancel.lastArgs').equals(['Unexpected Status 401: Unauthorized']);
  expect(onQueuedCancel.callCount(), 'onQueuedCancel.callCount').is(1);
  expect(onQueuedCancel.lastArgs(), 'onQueuedCancel.lastArgs').equals(
    ['A prior request ended with: Unexpected Status 401: Unauthorized']);
}