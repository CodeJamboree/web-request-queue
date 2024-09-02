import { msMap } from "./msMap.js";

export const timeSince = (date, unit = 'ms') => {
  const ms = new Date().getTime() - date.getTime();
  const msPerUnit = msMap[unit];
  if (!msPerUnit)
    throw new Error(`Unknown unit: ${unit}. Expected ${Object.keys(msMap).join(', ')}`);
  return ms / msPerUnit;
}
