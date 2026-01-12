import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GqlHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.switchToHttp();
    const { req } = ctx.getNext<{ req: FastifyRequest }>();
    const status = exception.getStatus();

    this.logger.error('An Exception occurred', {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });

    return exception;
  }
}
