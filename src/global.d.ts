import * as https from 'https';
import * as http from 'http';

export type requestCallback = (clientRequest: http.ClientRequest) => void;
export type responseCallback = (res: http.IncomingMessage) => void;
export type cancelCallback = (reason?: any) => void;

type urlString = string | URL;

export type requestArgs = [
  options: https.RequestOptions | urlString,
  callback?: responseCallback
] | [
  url: urlString,
  options: https.RequestOptions,
  callback?: responseCallback
];

export interface promisedQueue extends queueParams {
  promise: Promise<http.ClientRequest>
}

type PromiseLikeOrValue<T> = T | PromiseLike<T>;

export interface queueParams {
  args: requestArgs;
  onRequested?: requestCallback;
  onCancel?: cancelCallback
}
