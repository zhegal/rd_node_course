import "reflect-metadata";
import { Constructor } from "../container";

export type ModuleMetadata = {
  providers?: Constructor[];
  controllers?: Constructor[];
  imports?: Constructor[];
  exports?: Constructor[];
};

export function Module(metadata: ModuleMetadata) {
  return function (target: any) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
