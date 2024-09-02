import { state } from '../state';

export const msPerProgress = () => 1000 * state.getNum('progressSeconds');
