import { Injectable } from "../core/decorators";
import { HttpException } from "../core/exceptions";
import { ArgumentsHost, ExceptionFilter } from "../core/types";

@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost): void {
    const { res } = host;

    if (error instanceof HttpException) {
      res.status(error.status).json({
        statusCode: error.status,
        message: error.message,
        error: error.name,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Unexpected Error",
      });
    }
  }
}
