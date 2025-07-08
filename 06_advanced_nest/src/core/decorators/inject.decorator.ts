import "reflect-metadata";
import { InjectToken } from "../types";

export function Inject(token: InjectToken) {
  return function (target: Object, _: any, parameterIndex: number) {
    const existing = Reflect.getMetadata("custom:inject_tokens", target) || {};
    existing[parameterIndex] = token;
    Reflect.defineMetadata("custom:inject_tokens", existing, target);
  };
}
