// api-gateway/src/restaurante/dto/update-restaurante.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateRestauranteInput } from './create-restaurante.input';

@InputType()
export class UpdateRestauranteInput extends PartialType(CreateRestauranteInput) {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  email?: string;
}