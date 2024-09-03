export const replaceActiveTimer = (key: string) => `Attempted to replace ${key} before it was destroyed.`;

export const unknownUnit = (unknownUnit: string, units: Record<string, number>) => `Unknown unit: ${unknownUnit}. Expected ${Object.keys(units).join(', ')}`;

export const wrongArgCount = (name: string, count: number, min: number, max: number) => `Expected ${min} to ${max} arguments for ${name}. Received ${count}`;

export const finiteMinOrMore = (name: string, value: any, min: number) => `${name} out of range (${value}). Must be finite number at ${min} or more.`;

export const blocked = () => `Not allowing new requests.`;

export const otherRequestError = (error: Error) => `A prior request had an error: ${error}`;

export const badStatus = (statusCode: number, statusMessage: string) => `Unexpected Status ${statusCode}: ${statusMessage}`

export const canceledFromOtherRequest = (reason: string) => `A prior request ended with: ${reason}`;

export const defaultStatusMessage = (statusCode?: number) => '(no message)';

export const cancelingQueued = (count: number) => `Canceling ${count} queued requests`;

export const cancelQueueReason = () => `All queued requests canceled.`;

