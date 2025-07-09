import "reflect-metadata";
import { Type, ModuleMetadata } from "../types";

export function Module(metadata: ModuleMetadata) {
  return function (target: Type) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
