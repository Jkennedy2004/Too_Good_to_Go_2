// api-gateway/src/producto/dto/update-producto.input.ts
import { InputType, Field, Float, Int, PartialType } from '@nestjs/graphql';
import { CreateProductoInput } from './create-producto.input';

@InputType()
export class UpdateProductoInput extends PartialType(CreateProductoInput) {
  @Field({ nullable: true })
  nombre?: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Float, { nullable: true })
  precioRegular?: number;

  @Field(() => Int, { nullable: true })
  restauranteId?: number;
}