import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  providers: [InvitationsService, InvitationsResolver],
})
export class InvitationsModule {}
