import { PipeTransform } from "./pipe-transform.type";
import { Type } from "./type.interface";

export type PipesType = Type<PipeTransform> | InstanceType<Type<PipeTransform>>;
