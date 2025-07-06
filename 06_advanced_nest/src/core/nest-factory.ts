export class NestFactory {
  static async create(AppModule: any) {
    return {
      listen: async (port: number) => {
        console.log(`Listening on port ${port}`);
      },
    };
  }
}
