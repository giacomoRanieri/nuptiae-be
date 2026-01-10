/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { Role } from '../entities/role.enum';
import { GraphQLError } from 'graphql';
import { ValidationError } from '@nestjs/apollo';

@Injectable()
export class GqlVisibilityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<{ req: FastifyRequest }>();
    const user = req.user; // Assumendo che l'utente sia già stato iniettato nel request object, ad es. da una AuthGuard
    const args = gqlContext.getArgs();

    // Se l'utente non è autenticato, neghiamo l'accesso
    if (!user || !user.roles || user.roles.length == 0) {
      return false;
    }

    // L'utente 'admin' ha accesso completo a tutte le operazioni
    if (user.roles.indexOf(Role.Admin) !== -1) {
      if (!args.id) {
        throw new ValidationError("Admin must specify an 'id' argument.");
      }
      return true;
    }

    // L'utente 'user' può accedere solo a dati che gli appartengono
    if (user.roles.indexOf(Role.User) !== -1) {
      // Se l'argomento 'id' è presente e non corrisponde all'ID dell'utente, neghiamo l'accesso
      if (args.id && args.id !== user.uid) {
        throw new ForbiddenException(
          'Non sei autorizzato a visualizzare questi dati.',
        );
      }

      // Se non è specificato un ID nell'input, lo iniettiamo per filtrare i dati
      // Questo impedisce all'utente di vedere dati di altri utenti in query generiche
      if (!args.id) {
        args.id = user.uid;
      }

      return true;
    }

    // Negare l'accesso per qualsiasi altro ruolo non previsto
    return false;
  }
}
