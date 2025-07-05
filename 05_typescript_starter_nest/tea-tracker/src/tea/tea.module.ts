import { Module } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { ApiKeyGuard } from 'src/guards/api-key.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [TeaController],
  providers: [
    TeaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new ApiKeyGuard(reflector),
      inject: [Reflector],
    },
  ],
})
export class TeaModule {}
