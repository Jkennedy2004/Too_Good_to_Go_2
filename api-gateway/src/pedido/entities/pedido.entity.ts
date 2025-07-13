// api-gateway/src/pedido/entities/pedido.entity.ts
import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { DetallePedido } from '../../detalle-pedido/entities/detalle-pedido.entity'; // Se importará después

@ObjectType()
export class Pedido {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  usuarioId: number;

  @Field(() => Int)
  restauranteId: number;

  @Field()
  fechaCreacion: Date;

  @Field({ defaultValue: "pendiente" })
  estado: string;

  @Field(() => Float, { defaultValue: 0.0 })
  total: number;

  @Field(() => [DetallePedido]) // Relación con DetallePedido
  detallesPedido: DetallePedido[];

  @Field()
  createdAt: Date; // Usamos fechaCreacion del backend
  @Field()
  updatedAt: Date; // Asumimos fechaCreacion para updatedAt si no hay un campo específico
}