export const replaceActiveTimer = (key: string) =>
  `${key}: still active`;

export const unexpectedValue = (name: string, value: any) =>
  `${name}: unexpected value (${value})`;

export const outOfRange = (name: string, value: any, min: number, max: number | undefined) => {
  const prefix = `${name}: out of range (${value}).`;
  return max === undefined ? `${prefix} ${min} or more.` : `${prefix} ${min} to ${max}.`;
}
export const cascadingCancelation = (reason: any) =>
  `Cascading cancellation: ${reason}`;

export const responseStatus = (statusCode: number, statusMessage: string | undefined) => {
  const prefix = `Status code ${statusCode}`;
  return statusMessage ? `${prefix}: ${statusMessage}` : prefix;
}