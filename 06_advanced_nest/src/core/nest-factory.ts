import express, { Express, Request, Response } from "express";
import { container } from "./container";
import "reflect-metadata";
import { Constructor } from "./types/constructor.type";
import { registerRoutes } from "./utils/registerRoutes";

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
    app.use(express.json());

    factory.#processModule(AppModule, app);
    
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
        registerRoutes(app, ctrl);
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
