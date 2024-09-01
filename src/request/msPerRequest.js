import { state } from '../state.js';

export const msPerRequest = () => (state.get('throttleSeconds') * 1000) / state.get('throttleCount');
