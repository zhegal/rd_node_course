import { Request, Response } from "express";

export interface ExecutionContext {
  req: Request;
  res: Response;
}
