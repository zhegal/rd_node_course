import express, { Express, Request, Response } from "express";
import { container } from "./container";
import "reflect-metadata";
import { Route } from "./types/route.type";
import { Constructor } from "./types/constructor.type";

export class NestFactory {
  #containers = new Map<
    Constructor,
    {
      providers: Map<Constructor, Constructor>;
      exports: Set<Constructor>;
    }
  >();

  static async create(AppModule: any) {
    const factory = new NestFactory();
    const app: Express = express();

    factory.#processModule(AppModule, app);

    app.use(express.json());

    return {
      listen: async (port: number, callback?: () => void) =>
        new Promise<void>((resolve) => {
          app.listen(port, () => {
            console.log(`Server is started on ${port} port`);
            if (callback) callback();
            resolve();
          });
        }),
    };
  }

  #processModule(module: Constructor, app: Express) {
    const metadata = Reflect.getMetadata("module:metadata", module) || {};
    console.log(`Processing module: ${module.name}`);

    if (metadata.controllers) {
      metadata.controllers.forEach((ctrl: Constructor) => {
        console.log(`Found controller: ${ctrl.name}`);
        container.register(ctrl, ctrl);

        const prefix = Reflect.getMetadata("controller:prefix", ctrl) || "";
        const routes = Reflect.getMetadata("controller:routes", ctrl) || [];

        const instance = container.resolve(ctrl);

        routes.forEach((route: Route) => {
          const fullPath =
            "/" +
            [prefix, route.path].filter(Boolean).join("/").replace(/\/+/g, "/");
          app[route.method](fullPath, (req: Request, res: Response) => {
            const result = instance[route.handler](req, res);
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
      });
    }

    const providersMap = new Map<Constructor, Constructor>();
    const exportsSet = new Set<Constructor>();

    if (metadata.providers) {
      metadata.providers.forEach((prov: Constructor) => {
        providersMap.set(prov, prov);
        console.log(`Registered provider in module: ${prov.name}`);
      });
    }
    this.#containers.set(module, {
      providers: providersMap,
      exports: exportsSet,
    });

    if (metadata.imports) {
      metadata.imports.forEach((imported: Constructor) => {
        this.#processModule(imported, app);
      });
    }
  }
}
