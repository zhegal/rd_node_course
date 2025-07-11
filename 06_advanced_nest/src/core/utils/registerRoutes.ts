import { container } from "../container";
import { Express, Request, Response } from "express";
import {
  ArgumentMetadata,
  Type,
  Route,
  CanActivate,
  ExecutionContext,
} from "../types";
import { runPipes } from "./runPipes";
import { HttpException } from "../exceptions";

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
        const classGuards: any[] =
          Reflect.getMetadata("guards", controller) ?? [];
        const methodGuards: any[] =
          Reflect.getMetadata("guards", controller.prototype, route.handler) ??
          [];
        const guards = [...classGuards, ...methodGuards];

        for (const guard of guards) {
          const guardInstance = container.resolve(guard) as CanActivate;

          if (typeof guardInstance.canActivate !== "function") {
            throw new Error(
              `Guard ${guard.name} must implement canActivate(context)`
            );
          }

          const context: ExecutionContext = { req, res };
          const canActivate = await guardInstance.canActivate(context);
          if (!canActivate) {
            res.status(403).json({ statusCode: 403, message: "Forbidden" });
            return;
          }
        }

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

          let rawValue: unknown;
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
        if (err instanceof HttpException) {
          res.status(err.status).json({
            statusCode: err.status,
            message: err.message,
            error: err.name,
          });
        } else {
          res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
          });
        }
      }
    });

    console.log(`Registered ${route.method.toUpperCase()} ${fullPath}`);
  });
}
