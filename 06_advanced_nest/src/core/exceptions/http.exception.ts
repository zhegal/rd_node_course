export class HttpException extends Error {
  constructor(
    public readonly status: number,
    public override readonly message: string
  ) {
    super(message);
  }
}
