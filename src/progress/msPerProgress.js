import { state } from '../state.js';

export const msPerProgress = () => 1000 * state.get('progressSeconds');
