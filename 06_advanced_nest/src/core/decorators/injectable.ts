import { container } from "../container";
import { Constructor } from "../types/constructor.type";

export function Injectable() {
  return function (target: Constructor) {
    container.register(target, target);
  };
}
