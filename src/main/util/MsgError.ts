export class MsgError extends Error {
  code: number;
  message: string;
  data?: unknown = null;
  static ErrorName = 'MsgError';

  getErrorName() {
    return MsgError.ErrorName;
  }

  constructor(message: string, code?: number) {
    super(message);
    this.message = message;
    if (code != undefined) {
      this.code = code;
    } else {
      this.code = 1;
    }
  }
}
