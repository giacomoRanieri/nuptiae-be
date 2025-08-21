import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Participant, ParticipantSchema } from './participant.entity';

export type InvitationDocument = Invitation & Document;

export enum ConfirmationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  NOT_ATTENDING = 'not attending',
}

registerEnumType(ConfirmationStatus, {
  name: 'ConfirmationStatus',
});

@ObjectType()
@Schema()
export class Invitation {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop()
  recipient: string;

  @Field(() => ConfirmationStatus)
  @Prop({
    type: String,
    enum: ConfirmationStatus,
    default: ConfirmationStatus.PENDING,
  })
  confirmationStatus: 'pending' | 'confirmed' | 'not_attending';

  @Field({ nullable: true })
  @Prop({ required: false })
  email: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  phoneNumber?: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Partecipante', default: null }) // @Prop({ type: Types.ObjectId, ref: Participant.name, default: null })
  contactPersonId?: Types.ObjectId | null;

  @Field()
  @Prop({ default: false })
  isInterestedInAccommodation: boolean;

  @Field(() => [Participant])
  @Prop({ type: [ParticipantSchema], default: [] })
  participants: Participant[];
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
