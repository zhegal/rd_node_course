import { AppModule } from "./app.module";
import { NestFactory } from "./core/nest-factory";

async function bootstrap() {
  const PORT: number = +process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

bootstrap();
