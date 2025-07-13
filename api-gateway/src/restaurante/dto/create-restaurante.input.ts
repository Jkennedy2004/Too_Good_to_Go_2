// api-gateway/src/restaurante/dto/create-restaurante.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRestauranteInput {
  @Field()
  nombre: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  email: string;
}