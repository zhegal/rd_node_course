import { ExecutionContext } from "./execution-context.type";

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
