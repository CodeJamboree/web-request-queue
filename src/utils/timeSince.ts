import { msMap, unitType } from "./msMap";

export const timeSince = (date: Date, unit: unitType = 'ms') => {
  const ms = new Date().getTime() - date.getTime();
  const msPerUnit = msMap[unit];
  if (!msPerUnit)
    throw new Error(`Unknown unit: ${unit}. Expected ${Object.keys(msMap).join(', ')}`);
  return ms / msPerUnit;
}
