import { isFunction } from "./isFunction.js";

export const invoke = (fn: any, ...args: any[]) => isFunction(fn) ? fn(...args) : undefined;