import { Constructor } from "./constructor.type";

export type ModuleMetadata = {
  providers?: Constructor[];
  controllers?: Constructor[];
  imports?: Constructor[];
  exports?: Constructor[];
};
