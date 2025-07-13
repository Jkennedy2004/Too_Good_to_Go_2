// api-gateway/src/usuario/dto/update-usuario.input.ts
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUsuarioInput } from './create-usuario.input';

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  direccion?: string;

  @Field({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  password?: string; // Campo para actualizar el password, NO se debe incluir en Usuario.entity.ts
}