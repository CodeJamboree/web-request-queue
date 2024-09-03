import { isFunction } from "./isFunction.js";

export const invokeOrDefault = (fn: any, defaultFn: Function, ...args: any[]) => isFunction(fn) ? fn(...args) : defaultFn(...args);
