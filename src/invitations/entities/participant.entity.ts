import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum Age {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
}

@Schema()
export class Participant {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: Age, required: true })
  age: Age;

  @Prop({ type: String, default: '' })
  intolerances: string;

  @Prop({ default: false })
  celiac: boolean;

  @Prop({ default: false })
  vegetarian: boolean;

  @Prop({ default: false })
  vegan: boolean;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
