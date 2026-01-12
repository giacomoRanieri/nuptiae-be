import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Participant, ParticipantSchema } from './participant.entity';

export type InvitationDocument = Invitation & Document;

export enum ConfirmationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  NOT_ATTENDING = 'not attending',
}

@Schema()
export class Invitation {
  _id: Types.ObjectId;

  @Prop({ default: () => new Types.ObjectId().toHexString(), unique: true })
  secret: string;

  @Prop()
  recipient: string;

  @Prop({
    type: String,
    enum: ConfirmationStatus,
    default: ConfirmationStatus.PENDING,
  })
  confirmationStatus: 'pending' | 'confirmed' | 'not_attending';

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ type: Types.ObjectId, ref: 'Partecipante', default: null }) // @Prop({ type: Types.ObjectId, ref: Participant.name, default: null })
  contactPersonId?: Types.ObjectId | null;

  @Prop({ default: false })
  isInterestedInAccommodation: boolean;

  @Prop({ type: [ParticipantSchema], default: [] })
  participants: Participant[];
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
