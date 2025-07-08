import { container } from "../container";
import { Constructor } from "../types";

export function Injectable() {
  return function (target: Constructor) {
    container.register(target, target);
  };
}
