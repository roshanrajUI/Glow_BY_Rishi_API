export class ApiError extends Error {
  source?: string;
  status!: number;

  constructor(status: number, errMessage: string, source?: string) {
    super(errMessage);
    this.source = source;
    this.status = status;
  }
}
