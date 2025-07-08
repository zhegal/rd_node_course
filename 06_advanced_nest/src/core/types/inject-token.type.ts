import { Constructor } from "./constructor.type";

export type InjectToken<T = any> = string | symbol | Constructor<T>;
