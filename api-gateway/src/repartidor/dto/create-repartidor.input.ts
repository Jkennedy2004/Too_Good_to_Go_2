import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateRepartidorInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}