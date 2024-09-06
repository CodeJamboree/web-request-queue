import { requestArgs } from "./global.js";
import { asString } from "./asString.js";

export const parseJsonWithReviver = async <T = any>(reviver: (this: any, key: string, value: any) => any, ...args: requestArgs): Promise<T> => {
  const json = await asString(...args);
  return JSON.parse(json, reviver);
}
