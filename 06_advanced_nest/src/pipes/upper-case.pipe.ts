import { ArgumentMetadata, PipeTransform } from "src/core/types";

export class UpperCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }
}
