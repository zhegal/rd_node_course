import { BadRequestException } from "../core/exceptions";
import { ArgumentMetadata, PipeTransform } from "../core/types";
import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, meta: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch {
      throw new BadRequestException(
        `Validation failed for ${meta.type}${
          meta.data ? ` (${meta.data})` : ""
        }`
      );
    }
  }
}
