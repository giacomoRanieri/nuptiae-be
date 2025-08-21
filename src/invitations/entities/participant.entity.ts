import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum Age {
  ADULT = 'adult',
  CHILD = 'child',
  INFANT = 'infant',
}

registerEnumType(Age, {
  name: 'Age',
});

@ObjectType()
@Schema()
export class Participant {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field(() => Age)
  @Prop({ type: String, enum: Age, required: true })
  age: Age;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  intolerances: string[];

  @Field()
  @Prop({ default: false })
  celiac: boolean;

  @Field()
  @Prop({ default: false })
  vegetarian: boolean;

  @Field()
  @Prop({ default: false })
  vegan: boolean;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
