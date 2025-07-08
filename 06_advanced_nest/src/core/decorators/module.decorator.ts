import "reflect-metadata";
import { Constructor, ModuleMetadata } from "../types";

export function Module(metadata: ModuleMetadata) {
  return function (target: Constructor) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
