import { Writable } from "stream";
import { requestArgs } from "./global.js";
import { toStream } from "./toStream.js";

export const asString = async (...args: requestArgs): Promise<string> => {
  const chunks: any[] = [];
  const writable: Writable = new Writable({
    write(chunk: any, encoding: BufferEncoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  await toStream(writable, ...args);
  return new TextDecoder().decode(Buffer.concat(chunks));
}
