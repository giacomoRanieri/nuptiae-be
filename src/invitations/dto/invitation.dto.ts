import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Age } from '../entities/participant.entity';
import { ConfirmationStatus } from '../entities/invitation.entity';

registerEnumType(Age, {
  name: 'Age',
});

@ObjectType()
export class ParticipantDto {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field(() => Age)
  age: Age;

  @Field(() => String)
  intolerances: string;

  @Field()
  celiac: boolean;

  @Field()
  vegetarian: boolean;

  @Field()
  vegan: boolean;
}

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
