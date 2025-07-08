import { ParamType } from "./param.type";

export type ArgumentMetadata = {
  readonly index: number;
  readonly type: ParamType;
  readonly metatype?: new (...args: any[]) => any;
  readonly data?: string;
  readonly name?: string;
};
