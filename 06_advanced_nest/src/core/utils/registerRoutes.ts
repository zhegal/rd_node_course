import { container } from "../container";
import { Express, Request, Response } from "express";
import { ArgumentMetadata, Constructor, Route } from "../types";

export function registerRoutes(app: Express, controller: Constructor) {
  const prefix = Reflect.getMetadata("controller:prefix", controller) || "";
  const routes: Route[] =
    Reflect.getMetadata("controller:routes", controller) || [];
  const paramMeta: ArgumentMetadata[] =
    Reflect.getMetadata("mini:params", controller) || [];

  const instance = container.resolve(controller);

  routes.forEach((route) => {
    const fullPath =
      "/" + [prefix, route.path].filter(Boolean).join("/").replace(/\/+/g, "/");

    const paramMeta: ArgumentMetadata[] =
      Reflect.getMetadata("mini:params", controller.prototype, route.handler) ||
      [];

    app[route.method](fullPath, (req: Request, res: Response) => {
      const args: any[] = [];

      for (
        let i = 0;
        i < Math.max(...paramMeta.map((p) => p.index), 0) + 1;
        i++
      ) {
        const meta = paramMeta.find((p) => p.index === i);
        if (!meta) {
          args[i] = undefined;
          continue;
        }

        switch (meta.type) {
          case "query":
            args[i] = meta.data ? req.query[meta.data] : req.query;
            break;
          case "param":
            args[i] = meta.data ? req.params[meta.data] : req.params;
            break;
          case "body":
            args[i] = req.body;
            break;
          default:
            args[i] = undefined;
        }
      }

      const result = instance[route.handler](...args);

      if (result instanceof Promise) {
        result
          .then((data) => res.send(data))
          .catch((err) => res.status(500).send(err));
      } else {
        res.send(result);
      }
    });

    console.log(`Registered ${route.method.toUpperCase()} ${fullPath}`);
  });
}
