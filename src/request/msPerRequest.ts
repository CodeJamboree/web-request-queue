import { maxPerPeriod, secondsPerPeriod, state } from '../state.js';

export const msPerRequest = () => (state.getNum(secondsPerPeriod) * 1000) / state.getNum(maxPerPeriod);
