import { Writable } from "stream";
import { requestArgs } from "./global.js";
import { queue } from './queue.js';
import { handleEnd, handleError, handleResponse } from "./utils/handlers.js";

export const toStream = async (stream: Writable, ...args: requestArgs): Promise<Writable> => {
  return new Promise<Writable>(async (resolve, reject) => {
    handleError(stream, reject);
    handleEnd(stream, () => resolve(stream));
    const req = await queue(...args);
    handleResponse(req, res => {
      res.pipe(stream);
      handleError(res, reject);
      handleEnd(res, () => resolve(stream));
    });
    handleError(req, reject);
    req.end();
  });
}
