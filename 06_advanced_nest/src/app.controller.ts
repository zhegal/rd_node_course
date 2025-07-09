import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "./core/decorators";
import { UpperCasePipe } from "./pipes/upper-case.pipe";

@Controller()
export class AppController {
  @Get()
  getHello(@Query("test", new UpperCasePipe()) value: string) {
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
