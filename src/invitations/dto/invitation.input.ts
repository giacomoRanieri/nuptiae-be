import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParticipantInput } from './participant.input';
import { ConfirmationStatus } from '../entities/invitation.entity';

@InputType()
export class CreateInvitationInput {
  @IsNotEmpty()
  @Field()
  recipient: string;
}

@InputType()
export class UpdateInvitationInput {
  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  recipient?: string;

  @IsOptional()
  @Field(() => ConfirmationStatus, { defaultValue: ConfirmationStatus.PENDING })
  confirmationStatus?: ConfirmationStatus;

  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @Field({ nullable: true })
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isInterestedInAccommodation?: boolean;
}

@InputType()
export class UpdateInvitationParticipantsInput {
  @IsOptional()
  @IsMongoId()
  @Field(() => ID, { nullable: true })
  contactPersonId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantInput)
  @Field(() => [ParticipantInput])
  participants: ParticipantInput[];
}
