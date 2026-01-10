import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { FastifyRequest, FastifyReply } from 'fastify';

@Catch(HttpException)
export class GqlHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    const ctx = gqlHost.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    return exception;

    /*response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });*/
  }
}
