import { Controller } from "./core/decorators/controller";
import { Body, Param, Query } from "./core/decorators/param";
import { Get, Post } from "./core/decorators/route";

@Controller()
export class AppController {
  @Get()
  getHello(@Query("test") value: string) {
    return { message: "Hello world!!!", value };
  }

  @Post()
  create(@Body() body: any) {
    return { message: "created", body };
  }

  @Get(":id")
  getParam(@Param("id") id: string) {
    return { message: "get param!!", id };
  }
}
