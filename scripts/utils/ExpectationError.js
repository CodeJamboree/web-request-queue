export class ExpectationError extends Error {
  constructor(message, data) {
    super(`Failed Expectation: ${message}`);
    if (typeof data === 'object') {
      this.data = data;
    } else if (data !== undefined) {
      this.data = { details: data };
    }
  }
}