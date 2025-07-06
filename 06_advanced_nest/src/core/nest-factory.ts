import express, { Express } from "express";

export class NestFactory {
  static async create(AppModule: any) {
    const app: Express = express();
    app.use(express.json());

    return {
      listen: async (port: number) =>
        new Promise<void>((resolve) => {
          app.listen(port, () => {
            console.log(`Server is started on ${port} port`);
            resolve();
          });
        }),
    };
  }
}
