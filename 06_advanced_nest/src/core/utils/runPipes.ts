import { container } from "../container";
import { ArgumentMetadata, PipesType, PipeTransform, Type } from "../types";
import { getPipes } from "./getPipes";
import { isClass } from "./isClass";

export async function runPipes(
  controllerCls: Function,
  handler: Function,
  value: unknown,
  meta: ArgumentMetadata,
  globalPipes: PipesType[] = []
) {
  const pipes = getPipes(handler, controllerCls, globalPipes);

  let transformed = value;

  for (const pipe of pipes) {
    let pipeInstance: PipeTransform;

    if (isClass(pipe)) {
      try {
        pipeInstance = container.resolve(pipe as Type<PipeTransform>);
      } catch {
        pipeInstance = new (pipe as Type<PipeTransform>)();
      }
    } else {
      pipeInstance = pipe;
    }

    transformed = await Promise.resolve(
      pipeInstance.transform(transformed, meta)
    );
  }
  return transformed;
}
