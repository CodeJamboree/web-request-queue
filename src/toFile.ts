import fs from 'fs';
import { requestArgs } from "./global.js";
import { toStream } from "./toStream.js";

export const toFile = async (path: fs.PathLike, ...args: requestArgs): Promise<void> => {
  const stream = fs.createWriteStream(path);
  await toStream(stream, ...args).finally(() => {
    stream.close();
  });
}
