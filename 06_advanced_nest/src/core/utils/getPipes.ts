import { PIPES_METADATA } from "../decorators";
import { PipeTransform } from "../types";

export function getPipes(
  handler: Function,
  controller: Function,
  globalPipes: (PipeTransform | any)[] = []
): (PipeTransform | any)[] {
  const classPipes = Reflect.getMetadata(PIPES_METADATA, controller) ?? [];
  const methodPipes = Reflect.getMetadata(PIPES_METADATA, handler) ?? [];
  return [...globalPipes, ...classPipes, ...methodPipes];
}
