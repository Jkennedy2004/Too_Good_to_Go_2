// api-gateway/src/restaurante/entities/restaurante.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Restaurante {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field()
  direccion: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date; // Asume una fecha de creación
  @Field()
  updatedAt: Date; // Asume una fecha de actualización
}