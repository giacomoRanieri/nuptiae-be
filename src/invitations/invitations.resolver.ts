import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import {
  CreateInvitationInput,
  UpdateInvitationInput,
  UpdateInvitationParticipantsInput,
} from './dto/invitation.input';
import { InvitationDto } from './dto/invitation.dto';
import { InvitationsService } from './invitations.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Role } from '../auth/entities/role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { GqlHttpExceptionFilter } from '../filters/gql-http-exception.filter';
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard';
import { GqlVisibilityGuard } from 'src/auth/guards/gql-visibility.guard';
import { Invitation } from './entities/invitation.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';

const toDto = (invitation: Invitation): InvitationDto => {
  return {
    _id: invitation._id.toHexString(),
    secret: invitation.secret,
    recipient: invitation.recipient,
    confirmationStatus: invitation.confirmationStatus,
    email: invitation.email,
    phoneNumber: invitation.phoneNumber,
    contactPersonId: invitation.contactPersonId
      ? invitation.contactPersonId.toHexString()
      : null,
    isInterestedInAccommodation: invitation.isInterestedInAccommodation,
    participants: invitation.participants.map((participant) => ({
      _id: participant._id.toHexString(),
      name: participant.name,
      lastName: participant.lastName,
      age: participant.age,
      intolerances: participant.intolerances,
      celiac: participant.celiac,
      vegetarian: participant.vegetarian,
      vegan: participant.vegan,
    })),
  };
};

@Resolver(() => InvitationDto)
@UseGuards(GqlAuthGuard, GqlRolesGuard)
@UseFilters(GqlHttpExceptionFilter)
export class InvitationsResolver {
  constructor(private readonly invitationService: InvitationsService) {}

  @Mutation(() => InvitationDto)
  @Roles(Role.Admin)
  async createInvitation(
    @Args('input') input: CreateInvitationInput,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationService.create(input);
    return toDto(invitation);
  }

  @Query(() => [InvitationDto])
  @Roles(Role.Admin)
  async invitations(): Promise<InvitationDto[]> {
    const invitations = await this.invitationService.findAll();
    return invitations.map(toDto);
  }

  @ResolveField('secret', () => String, { nullable: true })
  getSecret(@Parent() invitation: InvitationDto, @CurrentUser() user: User) {
    if (user.roles.includes(Role.Admin)) {
      return invitation.secret;
    }
    return null;
  }

  @Mutation(() => InvitationDto)
  @UseGuards(GqlVisibilityGuard)
  async updateInvitation(
    @Args('id', { type: () => ID, nullable: true }) id: string,
    @Args('input') input: UpdateInvitationInput,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationService.update(id, input);
    return toDto(invitation);
  }

  @Mutation(() => InvitationDto)
  @UseGuards(GqlVisibilityGuard)
  async updateInvitationParticipants(
    @Args('id', { type: () => ID, nullable: true }) id: string,
    @Args('input') input: UpdateInvitationParticipantsInput,
  ): Promise<InvitationDto> {
    const invitation =
      await this.invitationService.updateInvitationParticipants(id, input);
    return toDto(invitation);
  }

  @Query(() => InvitationDto, { nullable: true })
  @UseGuards(GqlVisibilityGuard)
  async invitation(
    @Args('id', { type: () => ID, nullable: true }) id: string,
  ): Promise<InvitationDto> {
    const invitation = await this.invitationService.findOne(id);
    return toDto(invitation);
  }
}
