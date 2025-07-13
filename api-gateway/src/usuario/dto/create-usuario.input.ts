// api-gateway/src/usuario/dto/create-usuario.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUsuarioInput {
  @Field()
  nombre: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field()
  password: string; // Campo para el password al crear, NO se debe incluir en Usuario.entity.ts
}