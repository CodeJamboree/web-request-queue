import { expect } from '../../scripts/utils/expect.js';
import { state, recentRequest, firstRequest, requested } from '../state.js';
import { beforeRequest } from './beforeRequest.js';
import { timeLogger } from '../progress/timeLogger.js';

export const firstRequst = () => {
  state.removeDate(recentRequest);
  state.removeDate(firstRequest);
  state.setNum(requested, 0);
  timeLogger.stop();

  beforeRequest();

  expect(state.getDate(recentRequest), recentRequest).equals(new Date());
  expect(state.getDate(firstRequest), firstRequest).equals(new Date());
  expect(state.getNum(requested), requested).equals(1);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(true);

}

export const secondRequst = () => {

  state.setDate(recentRequest, new Date(2000, 0, 1));
  state.setDate(firstRequest, new Date(2000, 0, 2));
  state.setNum(requested, 1);
  timeLogger.stop();

  beforeRequest();

  expect(state.getDate(recentRequest), recentRequest).equals(new Date());
  expect(state.getDate(firstRequest), firstRequest).equals(new Date(2000, 0, 2));
  expect(state.getNum(requested), requested).equals(2);
  expect(timeLogger.hasStarted(), 'timeLogger.hasStarted').equals(false);

}