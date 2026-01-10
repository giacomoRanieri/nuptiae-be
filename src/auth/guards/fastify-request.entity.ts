import { User } from '../entities/user.entity';

// Extend FastifyRequest to include 'user'

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
