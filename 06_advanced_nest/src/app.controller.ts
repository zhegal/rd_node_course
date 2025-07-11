import z from "zod";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "./core/decorators";
import { ZodValidationPipe } from "./pipes";
import { AuthGuard } from "./core/guards";

const userSchema = z.object({
  name: z.string().min(3),
  age: z.number().int().nonnegative()
});

@Controller()
export class AppController {
  @Get()
  getHello(@Query("test") value: string) {
    return { message: "Hello world!!!", value };
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
