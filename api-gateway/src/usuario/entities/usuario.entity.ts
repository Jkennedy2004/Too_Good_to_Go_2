// api-gateway/src/usuario/entities/usuario.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Usuario {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  createdAt: Date; // Asume una fecha de creación
  @Field()
  updatedAt: Date; // Asume una fecha de actualización
}