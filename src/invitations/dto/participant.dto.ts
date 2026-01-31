import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Age } from '../entities/participant.entity';

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
