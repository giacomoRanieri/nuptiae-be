import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InvitationsService } from '../invitations/invitations.service';
import { JwtService } from '@nestjs/jwt';
import { Invitation } from '../invitations/entities/invitation.entity';
import { Token } from './entities/token.entity';
import { Role } from './entities/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private adminUsername: string;
  private adminPassword: string;

  constructor(
    @Inject(forwardRef(() => InvitationsService))
    private readonly invitationsService: InvitationsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.adminUsername =
      this.configService.getOrThrow<string>('ADMIN_USERNAME');
    this.adminPassword =
      this.configService.getOrThrow<string>('ADMIN_PASSWORD');
  }

  async signIn(
    invitationId: string,
    token: string,
  ): Promise<{ access_token: string }> {
    try {
      const inv: Invitation =
        await this.invitationsService.findOne(invitationId);
      if (inv.secret !== token) {
        throw new UnauthorizedException();
      }
      const payload: Token = { sub: inv._id.toString(), roles: [Role.User] };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
        }),
      };
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Auth failed do to: ' + e.message);
      throw new UnauthorizedException();
    }
  }

  async adminSignIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      if (username !== this.adminUsername || password !== this.adminPassword) {
        throw new UnauthorizedException();
      }
      const payload: Token = { sub: 'superuser', roles: [Role.Admin] };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
        }),
      };
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error('Admin auth failed do to: ' + e.message);
      throw new UnauthorizedException();
    }
  }

  async refreshToken(atCookie: string): Promise<{ access_token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync<Token>(atCookie);
      const payload: Token = { sub: decoded.sub, roles: decoded.roles };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '15m',
        }),
      };
    } catch (e) {
      this.logger.error('Token refresh failed due to: ', e);
      throw new UnauthorizedException();
    }
  }
}
