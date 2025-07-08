import "reflect-metadata";

export function Controller(prefix = ""): ClassDecorator {
  return function (target) {
    Reflect.defineMetadata("controller:prefix", prefix, target);
    Reflect.defineMetadata("controller:isController", true, target);
  };
}
