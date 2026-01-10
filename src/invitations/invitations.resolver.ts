import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {
  CreateInvitationInput,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from './dto/invitation.input';
import { Invitation } from './entities/invitation.entity';
import { InvitationsService } from './invitations.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Role } from '../auth/entities/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { GqlHttpExceptionFilter } from '../filters/gql-http-exception.filter';
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard';
import { GqlVisibilityGuard } from 'src/auth/guards/gql-visibility.guard';

@Resolver(() => Invitation)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
@UseFilters(GqlHttpExceptionFilter)
export class InvitationsResolver {
  constructor(private readonly invitationService: InvitationsService) {}

  @Mutation(() => Invitation)
  @Roles(Role.Admin)
  createInvitation(
    @Args('input') input: CreateInvitationInput,
  ): Promise<Invitation> {
    return this.invitationService.create(input);
  }

  @Mutation(() => Invitation)
  @UseGuards(GqlVisibilityGuard)
  updateInvitation(
    @Args('id', { type: () => ID, nullable: true }) id: string,
    @Args('input') input: UpdateInvitationInput,
  ): Promise<Invitation> {
    return this.invitationService.update(id, input);
  }

  @Mutation(() => Invitation)
  @UseGuards(GqlVisibilityGuard)
  updateInvitationParticipants(
    @Args('id', { type: () => ID, nullable: true }) id: string,
    @Args('input') input: UpdateInvitationParticipantsInput,
  ): Promise<Invitation> {
    return this.invitationService.updateInvitationParticipants(id, input);
  }

  @Query(() => Invitation, { nullable: true })
  @UseGuards(GqlVisibilityGuard)
  invitation(
    @Args('id', { type: () => ID, nullable: true }) id: string,
  ): Promise<Invitation> {
    return this.invitationService.findOne(id);
  }

  @Query(() => [Invitation])
  @Roles(Role.Admin)
  invitations(): Promise<Invitation[]> {
    return this.invitationService.findAll();
  }
}
