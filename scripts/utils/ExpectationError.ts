export class ExpectationError extends Error {
  data: object | undefined = undefined;
  constructor(message: string, data: any) {
    super(`Failed Expectation: ${message}`);
    if (typeof data === 'object') {
      this.data = data;
    } else if (data !== undefined) {
      this.data = { details: data };
    }
  }
}