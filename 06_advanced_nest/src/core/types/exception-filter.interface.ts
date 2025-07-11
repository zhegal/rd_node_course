import { Request, Response } from "express";

export interface ArgumentsHost {
  req: Request;
  res: Response;
  error: any;
}

export interface ExceptionFilter {
  catch(error: any, host: ArgumentsHost): void | Promise<void>;
}
