import { container } from "../container";
import { Type } from "../types";

export function Injectable() {
  return function (target: Type) {
    container.register(target, target);
  };
}
