import "reflect-metadata";

type Constructor<T = any> = new (...args: any[]) => T;
type Token<T = any> = string | symbol | Constructor<T>;

export function Inject(token: Token) {
  return function (target: Object, _: any, parameterIndex: number) {
    const existing = Reflect.getMetadata("custom:inject_tokens", target) || {};
    existing[parameterIndex] = token;
    Reflect.defineMetadata("custom:inject_tokens", existing, target);
  };
}
