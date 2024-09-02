import { state } from '../state.js';

export const msPerRequest = () => (state.getNum('throttleSeconds') * 1000) / state.getNum('throttleCount');
