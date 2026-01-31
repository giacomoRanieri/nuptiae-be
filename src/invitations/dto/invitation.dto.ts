import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ConfirmationStatus } from '../entities/invitation.entity';
import { ParticipantDto } from './participant.dto';

registerEnumType(ConfirmationStatus, {
  name: 'ConfirmationStatus',
});

@ObjectType()
export class InvitationDto {
  @Field(() => ID)
  _id: string;

  @Field()
  secret: string;

  @Field()
  recipient: string;

  @Field(() => ConfirmationStatus)
  confirmationStatus: 'pending' | 'confirmed' | 'not_attending';

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field(() => ID, { nullable: true })
  contactPersonId?: string | null;

  @Field()
  isInterestedInAccommodation: boolean;

  @Field(() => [ParticipantDto])
  participants: ParticipantDto[];
}
