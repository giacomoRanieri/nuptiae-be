import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../entities/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: FastifyRequest }>();
    const user = req.user;
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
