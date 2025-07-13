// api-gateway/src/detalle-pedido/entities/detalle-pedido.entity.ts
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Producto } from '../../producto/entities/producto.entity'; // Se importará después

@ObjectType()
export class DetallePedido {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  pedidoId: number; // Foreign Key

  @Field(() => Int)
  productoId: number; // Foreign Key

  @Field(() => Int, { nullable: true })
  ofertaReducidaId?: number; // Opcional, como en tu Pydantic

  @Field(() => Int)
  cantidad: number;

  @Field(() => Float)
  precioUnitario: number;

  @Field(() => Float)
  subtotal: number;

  // Relación con Producto (si lo resuelves en el Gateway)
  // @Field(() => Producto, { nullable: true })
  // producto?: Producto;
}