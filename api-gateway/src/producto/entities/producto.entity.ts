// api-gateway/src/producto/entities/producto.entity.ts
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Producto {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field({ nullable: true })
  descripcion?: string;

  @Field(() => Float)
  precioRegular: number; // precio_regular

  @Field(() => Int)
  restauranteId: number; // restaurante_id

  @Field()
  createdAt: Date; // Usaremos la fecha de creación del producto si existe, o current date
  @Field()
  updatedAt: Date; // Usaremos la fecha de actualización del producto si existe, o current date
}