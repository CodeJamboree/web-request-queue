import { RequestOptions } from 'https';
import { ClientRequest, IncomingMessage } from 'http';

export {
  ClientRequest,
  IncomingMessage,
  RequestOptions
}

export type requestCallback = (clientRequest: ClientRequest) => void;
export type responseCallback = (res: IncomingMessage) => void;
export type cancelCallback = (reason?: any) => void;

type urlString = string | URL;

export type requestArgs = [
  options: RequestOptions | urlString,
  callback?: responseCallback
] | [
  url: urlString,
  options: RequestOptions,
  callback?: responseCallback
];

export interface promisedQueue extends queueParams {
  promise: Promise<ClientRequest>
}

type PromiseLikeOrValue<T> = T | PromiseLike<T>;

export interface queueParams {
  args: requestArgs;
  onRequested?: requestCallback;
  onCancel?: cancelCallback
}
