import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsBoolean,
  IsArray,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Age } from '../entities/participant.entity';

@InputType()
export class ParticipantInput {
  @IsOptional()
  @IsMongoId()
  @Field(() => ID, { nullable: true })
  _id?: string;

  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @Field(() => Age)
  age: Age;

  @IsArray()
  @Field(() => [String], { nullable: 'itemsAndList', defaultValue: [] })
  intolerances: string[];

  @IsBoolean()
  @Field({ nullable: true, defaultValue: false })
  celiac: boolean;

  @IsBoolean()
  @Field({ nullable: true, defaultValue: false })
  vegetarian: boolean;

  @IsBoolean()
  @Field({ nullable: true, defaultValue: false })
  vegan: boolean;
}
