import { Writable } from "stream";
import { requestArgs } from "./global.js";
import { queue } from './queue.js';
import { handleEnd, handleError, handleResponse } from "./utils/handlers.js";

export const toStream = async <T extends Writable>(stream: T, ...args: requestArgs): Promise<T> => {
  return new Promise<T>(async (resolve, reject) => {
    handleError(stream, reject);
    handleEnd(stream, () => resolve(stream));
    const req = await queue(...args);
    handleResponse(req, res => {
      res.pipe(stream, { end: true });
      handleError(res, reject);
      handleEnd(res, () => resolve(stream));
    });
    handleError(req, reject);
    req.end();
  });
}
