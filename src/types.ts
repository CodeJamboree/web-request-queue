import http from 'http';
import https from 'https';

export type IncomingMessage2 = http.IncomingMessage;
export type RequestOptions = https.RequestOptions
export type ClientRequest = http.ClientRequest;

export interface IncomingMessage {
  statusCode?: number,
  statusMessage?: string,
  on(event: "error", listener: (err: Error) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "data", listener: (chunk: any) => void): this;
}


export interface requestHandler {
  (clientRequest: ClientRequest): void;
  // (clientRequest: PromiseLike<ClientRequest>): void;
};
export interface cancelHandler { (reason: any | PromiseLike<any>): void };
export interface responseHandler { (res: IncomingMessage): void };

export type requestArgsOptions = [
  options: RequestOptions | string | URL,
  callback?: responseHandler
];

export type requestArgsUrl = [
  url: string | URL,
  options: RequestOptions,
  callback?: responseHandler
];

export type requestArgs = requestArgsUrl | requestArgsOptions;

export interface queueParams {
  args: requestArgs,
  onRequested?: requestHandler,
  onCancel?: cancelHandler
}

export type queueArgs = [queueRequest: queueParams] | requestArgsUrl | requestArgsOptions
export interface promisedQueue extends queueParams {
  promise?: Promise<ClientRequest>
}