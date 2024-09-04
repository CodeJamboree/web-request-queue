import { msMap, unitType } from "./msMap.js";
import { WebQueueError } from '../WebQueueError.js';
import { unexpectedValue } from "../locale.js";

export const timeSince = (date: Date, unit: unitType = 'ms') => {
  const ms = new Date().getTime() - date.getTime();
  const msPerUnit = msMap[unit];
  if (!msPerUnit)
    throw new WebQueueError(unexpectedValue('unit', unit));
  return ms / msPerUnit;
}
