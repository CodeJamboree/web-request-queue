import { state, recentRequest, firstRequest, requested } from '../state.js';

export const beforeRequest = () => {
  state.setNow(recentRequest);
  if (!state.getDate(firstRequest)) {
    state.setNow(firstRequest);
  }
  state.increment(requested);
}