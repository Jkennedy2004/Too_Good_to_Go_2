// api-gateway/src/detalle-pedido/dto/create-detalle-pedido.input.ts
import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateDetallePedidoInput {
  @Field(() => Int)
  productoId: number;

  @Field(() => Int)
  cantidad: number;

  @Field(() => Float)
  precioUnitario: number;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Int, { nullable: true })
  ofertaReducidaId?: number;
}