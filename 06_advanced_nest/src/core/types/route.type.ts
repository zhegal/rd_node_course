import { Method } from "./method.type";

export type Route = {
  method: Method;
  path: string;
  handler: string;
};
