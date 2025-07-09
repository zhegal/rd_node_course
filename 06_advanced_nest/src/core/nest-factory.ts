import "reflect-metadata";
import express, { Express } from "express";
import { container } from "./container";
import { registerRoutes } from "./utils/registerRoutes";
import { PipeTransform, Type } from "./types";

export class NestFactory {
  #containers = new Map<
    Type,
    {
      providers: Map<Type, Type>;
      exports: Set<Type>;
    }
  >();
  #globalPipes: Type<PipeTransform>[] = [];

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
      useGlobalPipes: (...pipes: Type<PipeTransform>[]) =>
        factory.useGlobalPipes(...pipes),
    };
  }

  #processModule(module: Type, app: Express) {
    const metadata = Reflect.getMetadata("module:metadata", module) || {};
    console.log(`Processing module: ${module.name}`);

    if (metadata.controllers) {
      metadata.controllers.forEach((ctrl: Type) => {
        console.log(`Found controller: ${ctrl.name}`);
        container.register(ctrl, ctrl);
        registerRoutes(app, ctrl, this.#globalPipes);
      });
    }

    const providersMap = new Map<Type, Type>();
    const exportsSet = new Set<Type>();

    if (metadata.providers) {
      metadata.providers.forEach((prov: Type) => {
        providersMap.set(prov, prov);
        console.log(`Registered provider in module: ${prov.name}`);
      });
    }
    this.#containers.set(module, {
      providers: providersMap,
      exports: exportsSet,
    });

    if (metadata.imports) {
      metadata.imports.forEach((imported: Type) => {
        this.#processModule(imported, app);
      });
    }
  }

  useGlobalPipes(...pipes: Type<PipeTransform>[]) {
    this.#globalPipes.push(...pipes);
  }
}
