import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { FastifyReply } from 'fastify';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

// filepath: /workspaces/nuptiae-be/src/auth/auth.controller.ts

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('id') id: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    if (!id) {
      throw new UnauthorizedException('Missing invitation id');
    }
    const { access_token } = await this.authService.signIn(id);

    // Set JWT in HTTP-only cookie, expires in 15 minutes
    res.header(
      'Set-Cookie',
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${15 * 60}; Path=/`,
    );

    return { message: 'Login successful' };
  }

  @Post('admin/login')
  @HttpCode(200)
  async adminLogin(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    if (!username) {
      throw new UnauthorizedException('Missing username');
    }
    if (!password) {
      throw new UnauthorizedException('Missing password');
    }
    const { access_token } = await this.authService.adminSignIn(
      username,
      password,
    );

    // Set JWT in HTTP-only cookie, expires in 15 minutes
    res.header(
      'Set-Cookie',
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${15 * 60}; Path=/`,
    );

    return { message: 'Login successful' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Res({ passthrough: true }) res: FastifyReply) {
    // Parse cookies from the request headers
    const cookieHeader = res.request.headers['cookie'];
    const cookies = cookieHeader
      ? Object.fromEntries(
          cookieHeader.split(';').map((cookie) => {
            const [name, ...rest] = cookie.trim().split('=');
            return [name, rest.join('=')];
          }),
        )
      : {};
    const atCookie = cookies['at'];
    if (!atCookie) {
      throw new UnauthorizedException('Missing access token cookie');
    }

    const { access_token } = await this.authService.refreshToken(atCookie);

    res.header(
      'Set-Cookie',
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${15 * 60}; Path=/`,
    );

    return { message: 'Token refreshed' };
  }
}
