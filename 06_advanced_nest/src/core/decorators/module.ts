import "reflect-metadata";
import { ModuleMetadata } from "../types/module-metadata.type";
import { Constructor } from "../types/constructor.type";

export function Module(metadata: ModuleMetadata) {
  return function (target: Constructor) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
