import { PipesType } from "../types";

export const PIPES_METADATA = Symbol("pipes");

export function UsePipes(
  ...pipes: PipesType[]
): ClassDecorator & MethodDecorator {
  return (target: any, key?: string | symbol) => {
    const metaTarget = key ? target[key] : target;
    Reflect.defineMetadata(PIPES_METADATA, pipes, metaTarget);
  };
}
