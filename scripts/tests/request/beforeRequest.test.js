import { expect } from '../../utils/expect.js';
import { state } from '../../../src/state.js';
import { beforeRequest } from '../../../src/request/beforeRequest.js';
import { timeLogger } from '../../../src/progress/timeLogger.js';

export const name = 'beforeRequest';

// state.set('lastAt', new Date());
//   if (!state.get('firstAt')) {
//     timeLogger.start();
//     state.set('firstAt', new Date());
//   }
//     state.set('requestCount', state.get('requestCount') + 1);

export const beforeRequestFirstRequst = () => {
  state.remove('lastAt');
  state.remove('firstAt');
  state.set('requestCount', 0);
  timeLogger.stop();

  beforeRequest();

  expect(state.get('lastAt'), 'lastAt').equals(new Date());
  expect(state.get('firstAt'), 'firstAt').equals(new Date());
  expect(state.get('requestCount'), 'requestCount').equals(1);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(true);

}

export const beforeRequestSecondRequst = () => {

  state.set('lastAt', new Date(2000, 0, 1));
  state.set('firstAt', new Date(2000, 0, 2));
  state.set('requestCount', 1);
  timeLogger.stop();

  beforeRequest();

  expect(state.get('lastAt'), 'lastAt').equals(new Date());
  expect(state.get('firstAt'), 'firstAt').equals(new Date(2000, 0, 2));
  expect(state.get('requestCount'), 'requestCount').equals(2);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(false);

}