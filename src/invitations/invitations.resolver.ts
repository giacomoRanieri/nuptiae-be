import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {
  CreateInvitationInput,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from './dto/invitation.input';
import { Invitation } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';

@Resolver(() => Invitation)
export class InvitationsResolver {
  constructor(private readonly invitationService: InvitationsService) {}

  @Mutation(() => Invitation)
  createInvitation(
    @Args('input') input: CreateInvitationInput,
  ): Promise<Invitation> {
    return this.invitationService.create(input);
  }

  @Mutation(() => Invitation)
  updateInvitation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateInvitationInput,
  ): Promise<Invitation> {
    return this.invitationService.update(id, input);
  }

  @Mutation(() => Invitation)
  updateInvitationParticipants(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateInvitationParticipantsInput,
  ): Promise<Invitation> {
    return this.invitationService.updateInvitationParticipants(id, input);
  }

  @Query(() => Invitation, { nullable: true })
  invitation(@Args('id', { type: () => ID }) id: string): Promise<Invitation> {
    return this.invitationService.findOne(id);
  }

  @Query(() => [Invitation])
  invitations(): Promise<Invitation[]> {
    return this.invitationService.findAll();
  }
}
