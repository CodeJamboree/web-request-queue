import { finiteMinOrMore } from "../locale.js";
import { WebQueueError } from "../WebQueueError.js";
import { isNumber } from "./isNumber.js";

export const guardOneOrMore = (value: number, name: string) => {
  if (isNaN(value) || !isNumber(value) || !isFinite(value) || value < 1) {
    throw new WebQueueError(finiteMinOrMore(name, value, 1));
  }
}
