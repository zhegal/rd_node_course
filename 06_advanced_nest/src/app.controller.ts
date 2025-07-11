import z from "zod";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from "./core/decorators";
import { ZodValidationPipe } from "./pipes";
import { AuthGuard } from "./guards";
import { HttpExceptionFilter } from "./filters";
import { HttpException } from "./core/exceptions";

const userSchema = z.object({
  name: z.string().min(3),
  age: z.number().int().nonnegative(),
});

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  @Get()
  getHello(@Query("test") value: string) {
    return { message: "Hello world!!!", value };
  }

  @Get("error")
  getError() {
    throw new HttpException(400, "You've got an error exception");
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body(new ZodValidationPipe(userSchema)) body: any) {
    return { message: "created", body };
  }

  @Get(":id")
  getParam(@Param("id") id: string) {
    return { message: "get param!!", id };
  }
}
