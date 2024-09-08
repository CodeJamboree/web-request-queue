import { dateUtils } from '@codejamboree/js-test';
import { expect } from '@codejamboree/js-test';
import { state, recentRequest, firstRequest, requested } from '../state.js';
import { beforeRequest } from './beforeRequest.js';

export const beforeEach = () => {
  dateUtils.freeze();
}
export const afterEach = () => {
  dateUtils.restore();
}
export const firstRequst = () => {
  state.removeDate(recentRequest);
  state.removeDate(firstRequest);
  state.setNum(requested, 0);

  beforeRequest();

  expect(state.getDate(recentRequest), recentRequest).equals(new Date());
  expect(state.getDate(firstRequest), firstRequest).equals(new Date());
  expect(state.getNum(requested), requested).equals(1);

}

export const secondRequst = () => {

  state.setDate(recentRequest, new Date(2000, 0, 1));
  state.setDate(firstRequest, new Date(2000, 0, 2));
  state.setNum(requested, 1);

  beforeRequest();

  expect(state.getDate(recentRequest), recentRequest).equals(new Date());
  expect(state.getDate(firstRequest), firstRequest).equals(new Date(2000, 0, 2));
  expect(state.getNum(requested), requested).equals(2);

}