import { ExecutionContext } from "../core/types";
import { Injectable } from "../core/decorators";
import { HttpException } from "../core/exceptions";

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
