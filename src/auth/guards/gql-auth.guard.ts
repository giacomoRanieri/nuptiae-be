/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  // UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InvitationsService } from '../../invitations/invitations.service';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/auth/entities/token.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.enum';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(
    private readonly invitationService: InvitationsService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: FastifyRequest }>();
    const rawToken = req.cookies['at'] || req.headers['at'];
    const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
    if (!token) {
      throw new UnauthorizedException('Authetication token is missing.');
    }
    let tokenData;
    try {
      tokenData = await this.jwtService.verifyAsync<Token>(token);
    } catch (err) {
      this.logger.error('Token verification failed due to: ', err);
      throw new UnauthorizedException('Token not valid.');
    }

    if (!tokenData.sub) {
      throw new UnauthorizedException('Token payload not valid.');
    }
    if (tokenData.sub === 'superuser') {
      this.logger.debug('Admin access granted');
    } else if (!(await this.invitationService.findOne(tokenData.sub))) {
      throw new UnauthorizedException('Invitation not valid.');
    }

    const user = new User();
    user.uid = tokenData.sub;
    user.roles = tokenData.roles.map((r) => r as Role);
    req.user = user;
    return true;
  }
}
