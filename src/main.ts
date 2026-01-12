import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  fastifyAdapter.register(fastifyCookie as any, {});
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { logger: new ConsoleLogger({ colors: false, prefix: 'Nuptiae' }) },
  );
  await app.listen(3001);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
