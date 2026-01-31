import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  fastifyAdapter.register(fastifyCookie as any, {});
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { logger: new ConsoleLogger({ colors: false, prefix: 'Nuptiae' }) },
  );
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Nuptiae API')
    .setDescription('The Nuptiae API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  //SwaggerModule.setup('api', app, document);
  fs.writeFileSync(
    configService.get<string>('swagger.spec', './swagger-spec.json'),
    JSON.stringify(document, null, 2),
  );

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`Application running at ${await app.getUrl()}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
