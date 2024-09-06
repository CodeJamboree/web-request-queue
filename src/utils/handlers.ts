import EventEmitter from "events";
import * as http from 'http';

const error = 'error';
const end = 'end';
const response = 'response';

const handler = (target: EventEmitter, eventName: string, options: (...args: any[]) => void) =>
  target.on(eventName, options);

export const handleError = (target: EventEmitter, options: (err?: any) => void) =>
  handler(target, error, options);

export const handleEnd = (target: EventEmitter, options: (...args: any[]) => void) =>
  handler(target, end, options);

export const handleResponse = (target: EventEmitter, options: (res: http.IncomingMessage) => void) =>
  handler(target, response, options);
