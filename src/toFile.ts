import fs from 'fs';
import { requestArgs } from "./global.js";
import { toStream } from "./toStream.js";

export const toFile = async (path: fs.PathLike, ...args: requestArgs): Promise<void> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(path);
    stream.on('close', resolve);
    stream.on('error', reject);
    toStream(stream, ...args)
      .catch(reject)
      .finally(() => {
        stream.close();
      });
  });
}
