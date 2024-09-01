export class ExpectationError extends Error {
  constructor(message, data) {
    super(message);
    if (typeof data === 'object') {
      this.data = data;
    } else if (data !== undefined) {
      this.data = { details: data };
    }
  }
}