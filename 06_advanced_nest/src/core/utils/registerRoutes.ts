import { container } from "../container";
import { Express, Request, Response } from "express";
import { ArgumentMetadata, Type, Route } from "../types";
import { runPipes } from "./runPipes";

export async function registerRoutes(
  app: Express,
  controller: Type,
  globalPipes: Type[] = []
) {
  const prefix = Reflect.getMetadata("controller:prefix", controller) || "";
  const routes: Route[] =
    Reflect.getMetadata("controller:routes", controller) || [];

  const instance = container.resolve(controller);

  routes.forEach((route) => {
    const fullPath =
      "/" + [prefix, route.path].filter(Boolean).join("/").replace(/\/+/g, "/");

    const paramMeta: ArgumentMetadata[] =
      Reflect.getMetadata("mini:params", controller.prototype, route.handler) ||
      [];

    app[route.method](fullPath, async (req: Request, res: Response) => {
      const args: any[] = [];

      try {
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

          let rawValue;
          switch (meta.type) {
            case "query":
              rawValue = meta.data ? req.query[meta.data] : req.query;
              break;
            case "param":
              rawValue = meta.data ? req.params[meta.data] : req.params;
              break;
            case "body":
              rawValue = req.body;
              break;
            default:
              rawValue = undefined;
          }

          args[i] = await runPipes(
            controller,
            instance[route.handler],
            rawValue,
            meta,
            [...(meta.pipes ?? []), ...globalPipes]
          );
        }

        const result = await instance[route.handler](...args);
        res.send(result);
      } catch (err: any) {
        if (err?.status === 400) {
          res.status(400).json({
            statusCode: 400,
            message: err.message,
            error: "Bad Request",
          });
        } else {
          res.status(500).send(err);
        }
      }
    });

    console.log(`Registered ${route.method.toUpperCase()} ${fullPath}`);
  });
}
