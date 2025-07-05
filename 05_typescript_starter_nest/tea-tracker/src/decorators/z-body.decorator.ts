import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export const ZBody = (schema: ZodSchema) =>
  createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try {
      return await schema.parseAsync(request.body);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  })();
