import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from "./core/decorators";
import { UpperCasePipe } from "./pipes/upper-case.pipe";

@Controller()
@UsePipes(UpperCasePipe)
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
