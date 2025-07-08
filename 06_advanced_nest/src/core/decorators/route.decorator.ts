import { Method } from "../types";

export function Route(method: Method, path: string) {
  return function (target: any, key: string) {
    const routes =
      Reflect.getMetadata("controller:routes", target.constructor) || [];
    routes.push({ method, path, handler: key });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

export const Get = (path: string = "") => Route("get", path);
export const Post = (path: string = "") => Route("post", path);
export const Put = (path: string = "") => Route("put", path);
export const Patch = (path: string = "") => Route("patch", path);
export const Delete = (path: string = "") => Route("delete", path);
