import { expect } from '../../scripts/utils/expect.js';
import { state } from '../state.js';
import { beforeRequest } from './beforeRequest.js';
import { timeLogger } from '../progress/timeLogger.js';

export const firstRequst = () => {
  state.removeDate('lastAt');
  state.removeDate('firstAt');
  state.setNum('requestCount', 0);
  timeLogger.stop();

  beforeRequest();

  expect(state.getDate('lastAt'), 'lastAt').equals(new Date());
  expect(state.getDate('firstAt'), 'firstAt').equals(new Date());
  expect(state.getNum('requestCount'), 'requestCount').equals(1);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(true);

}

export const secondRequst = () => {

  state.setDate('lastAt', new Date(2000, 0, 1));
  state.setDate('firstAt', new Date(2000, 0, 2));
  state.setNum('requestCount', 1);
  timeLogger.stop();

  beforeRequest();

  expect(state.getDate('lastAt'), 'lastAt').equals(new Date());
  expect(state.getDate('firstAt'), 'firstAt').equals(new Date(2000, 0, 2));
  expect(state.getNum('requestCount'), 'requestCount').equals(2);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(false);

}