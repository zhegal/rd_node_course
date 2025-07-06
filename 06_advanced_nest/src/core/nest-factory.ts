import express, { Express } from "express";
import { Constructor } from "./container";

export class NestFactory {
  #providers = new Set();

  static async create(AppModule: any) {
    const factory = new NestFactory();
    factory.#processModule(AppModule);

    const app: Express = express();
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

  #processModule(module: Constructor) {
    const metadata = Reflect.getMetadata("module:metadata", module) || {};
    console.log(`Processing module: ${module.name}`);

    if (metadata.providers) {
      metadata.providers.forEach((prov: any) => this.#providers.add(prov));
    }

    if (metadata.imports) {
      metadata.imports.forEach((imported: any) => {
        this.#processModule(imported);
      });
    }

    if (metadata.controllers) {
      metadata.controllers.forEach((ctrl: any) => {
        console.log(`Controller found: ${ctrl.name}`);
      });
    }
  }
}
