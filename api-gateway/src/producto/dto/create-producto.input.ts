// api-gateway/src/producto/dto/create-producto.input.ts
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductoInput {
  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Float)
  precioRegular: number;

  @Field(() => Int)
  restauranteId: number;
}