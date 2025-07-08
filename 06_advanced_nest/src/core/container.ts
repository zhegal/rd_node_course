import "reflect-metadata";
import { Constructor } from "./types";

export class Container {
  #registered = new Map();
  #singletons = new Map();

  resolve<T>(token: Constructor<T>): T {
    if (this.#singletons.has(token)) {
      return this.#singletons.get(token);
    }
    const cs = this.#registered.get(token);
    if (!cs) {
      throw new Error(`Token ${token.name} is not registered.`);
    }

    const paramTypes: Constructor[] =
      Reflect.getMetadata("design:paramtypes", token) || [];
    const injectTokens: Record<number, Constructor> =
      Reflect.getMetadata("custom:inject_tokens", token) || {};

    const resolvedParams = paramTypes.map((originalToken, index) => {
      const depToken = injectTokens[index] || originalToken;

      if (depToken === token) {
        throw new Error(
          `Circular dependency detected for token ${token.name}.`
        );
      }

      return this.resolve(depToken);
    });

    const resolved = new cs(...resolvedParams);
    this.#singletons.set(token, resolved);
    return resolved;
  }

  register<T extends Function>(token: T, member: T): void {
    if (this.#registered.has(token)) {
      throw new Error(`Token ${token.name} is already registered.`);
    }
    this.#registered.set(token, member);
  }
}

export const container = new Container();
