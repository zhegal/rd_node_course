import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tea Tracker API')
    .setDescription('Tea Tracker NestJS App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  logger.log(`Swagger docs available at http://localhost:${PORT}/docs`);

  process.on('SIGINT', () => {
    console.log('Bye tea-lovers 👋');
    process.exit(0);
  });

  await app.listen(PORT);
}
bootstrap();
