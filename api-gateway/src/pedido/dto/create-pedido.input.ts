// api-gateway/src/pedido/dto/create-pedido.input.ts
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { CreateDetallePedidoInput } from '../../detalle-pedido/dto/create-detalle-pedido.input'; // Se importará después

@InputType()
export class CreatePedidoInput {
  @Field(() => Int)
  usuarioId: number;

  @Field(() => Int)
  restauranteId: number;

  @Field({ nullable: true, defaultValue: "pendiente" })
  estado?: string;

  @Field(() => Float, { nullable: true, defaultValue: 0.0 })
  total?: number;

  @Field(() => [CreateDetallePedidoInput]) // Mismo nombre que en el Pydantic PedidoCreate
  detalles: CreateDetallePedidoInput[];
}