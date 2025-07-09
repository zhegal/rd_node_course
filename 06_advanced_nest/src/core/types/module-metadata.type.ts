import { Type } from "./type.interface";

export type ModuleMetadata = {
  providers?: Type[];
  controllers?: Type[];
  imports?: Type[];
  exports?: Type[];
};
