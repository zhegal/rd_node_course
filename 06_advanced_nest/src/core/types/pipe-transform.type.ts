import { ArgumentMetadata } from "./argument-metadata.type";

export type PipeTransform<T = any, R = any> = {
  transform(value: T, metadata: ArgumentMetadata): R | Promise<R>;
}