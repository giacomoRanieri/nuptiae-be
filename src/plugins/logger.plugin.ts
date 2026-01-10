/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import * as util from 'util';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from '@apollo/server';

@Plugin()
export class LoggerPlugin implements ApolloServerPlugin {
  private readonly logger = new Logger(LoggerPlugin.name);

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener<BaseContext>> {
    const thatLogger = this.logger;
    if (requestContext.request.operationName !== 'IntrospectionQuery') {
      thatLogger.debug(
        `request query: ${requestContext.request.query || 'undefined'}`,
      );
    }
    return {
      async willSendResponse(
        requestContextWillSendResponse: GraphQLRequestContextWillSendResponse<BaseContext>,
      ): Promise<void> {
        if (
          requestContextWillSendResponse.request.operationName !==
          'IntrospectionQuery'
        ) {
          if (!requestContextWillSendResponse.errors) {
            thatLogger.debug(`response without any errors`);
          } else {
            const errors = requestContextWillSendResponse.errors.concat();
            const body: any = requestContextWillSendResponse.response.body;
            const responseErrors = body.singleResult?.errors?.concat();
            if (errors && responseErrors) {
              for (let i = 0; i < errors.length; i++) {
                const result = {
                  ...responseErrors[i],
                  stack: errors[i].stack,
                };
                if (result.extensions) {
                  delete result.extensions.exception;
                }
                if (
                  result.extensions &&
                  result.extensions.code !== 'INTERNAL_SERVER_ERROR'
                ) {
                  thatLogger.debug(
                    `response with errors: ${util.inspect(result, {
                      depth: 4,
                    })}`,
                  );
                } else {
                  thatLogger.debug(
                    `response with errors: ${util.inspect(result, {
                      depth: 4,
                    })}`,
                  );
                }
              }
            }
          }
        }
      },
    };
  }
}
