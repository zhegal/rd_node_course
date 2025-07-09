import { Type } from "./type.interface";

export type InjectToken<T = any> = string | symbol | Type<T>;
