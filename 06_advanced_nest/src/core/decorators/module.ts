import "reflect-metadata";

export type ModuleMetadata = {
  providers?: any[];
  controllers?: any[];
  imports?: any[];
};

export function Module(metadata: ModuleMetadata) {
  return function (target: any) {
    Reflect.defineMetadata("module:metadata", metadata, target);
  };
}
