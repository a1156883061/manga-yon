export class MsgError extends Error {
  code: number;
  message: string;
  data?: unknown = null;

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
