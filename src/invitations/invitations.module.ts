import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { LoggerPlugin } from 'src/plugins/logger.plugin';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  providers: [InvitationsService, InvitationsResolver, LoggerPlugin],
  exports: [InvitationsService],
})
export class InvitationsModule {}
