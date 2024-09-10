import { PassThrough } from "stream";
import { requestArgs } from "./global.js";
import { toStream } from "./toStream.js";

export const asString = async (...args: requestArgs): Promise<string> => new Promise<string>((resolve, reject) => {
  const chunks: Buffer[] = [];
  const stream = new PassThrough({ objectMode: true });
  stream.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });
  stream.on('end', () => {
    resolve(Buffer.concat(chunks).toString('utf8'));
  })
  toStream(stream, ...args);
});
