import { Controller } from "./core/decorators/controller";
import { Get } from "./core/decorators/route";

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: "Hello world!!!" };
  }
}
