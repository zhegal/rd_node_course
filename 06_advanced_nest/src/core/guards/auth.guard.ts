import { Injectable } from "../decorators";
import { HttpException } from "../exceptions";
import { ExecutionContext } from "../types";

@Injectable()
export class AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = context;

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Bearer im_rd_student") {
      throw new HttpException(401, "Unauthorized");
    }

    return true;
  }
}
