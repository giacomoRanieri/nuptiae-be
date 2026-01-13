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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';

// filepath: /workspaces/nuptiae-be/src/auth/auth.controller.ts

@ApiTags('Auth')
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in as a guest' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { access_token } = await this.authService.signIn(
      loginDto.id,
      loginDto.token,
    );

    // Set JWT in HTTP-only cookie, expires in 15 minutes
    res.header(
      'Set-Cookie',
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${
        15 * 60
      }; Path=/`,
    );

    return { message: 'Login successful' };
  }

  @Post('admin/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in as an admin' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async adminLogin(
    @Body() adminLoginDto: AdminLoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { access_token } = await this.authService.adminSignIn(
      adminLoginDto.username,
      adminLoginDto.password,
    );

    // Set JWT in HTTP-only cookie, expires in 15 minutes
    res.header(
      'Set-Cookie',
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${
        15 * 60
      }; Path=/`,
    );

    return { message: 'Login successful' };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Refresh the access token using the refresh token stored in an http-only cookie.',
  })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
      `at=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${
        15 * 60
      }; Path=/`,
    );

    return { message: 'Token refreshed' };
  }
}
