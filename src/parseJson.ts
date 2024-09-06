import { requestArgs } from "./global.js";
import { asString } from "./asString.js";

export const parseJson = async <T = any>(...args: requestArgs): Promise<T> => {
  const json = await asString(...args);
  return JSON.parse(json);
}
