import { Constructor, container } from "../container";

export function Injectable() {
  return function (target: Constructor) {
    container.register(target, target);
  };
}
