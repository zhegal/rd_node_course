import { ArgumentMetadata, ParamType, PipesType } from "../types";

function paramDecorator(type: ParamType) {
  return function (
    dataOrPipe?: string | PipesType,
    ...restPipes: PipesType[]
  ): ParameterDecorator {
    return (target: any, name: string | symbol, index: number) => {
      const paramTypes =
        Reflect.getMetadata("design:paramtypes", target, name) ?? [];
      const metatype = paramTypes[index];

      let data: string | undefined;
      let pipes: PipesType[] = [];

      if (typeof dataOrPipe === "string") {
        data = dataOrPipe;
        pipes = restPipes;
      } else {
        data = undefined;
        pipes = [dataOrPipe, ...restPipes].filter(Boolean) as PipesType[];
      }

      const params: ArgumentMetadata[] =
        Reflect.getMetadata("mini:params", target, name) ?? [];

      params.push({
        index,
        type,
        metatype,
        data,
        name: name.toString(),
        pipes,
      });

      Reflect.defineMetadata("mini:params", params, target, name);
    };
  };
}

export const Param = paramDecorator("param");
export const Query = paramDecorator("query");
export const Body = paramDecorator("body");
