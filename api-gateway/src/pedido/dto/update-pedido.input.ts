// api-gateway/src/pedido/dto/update-pedido.input.ts
import { InputType, Field, Float, PartialType } from '@nestjs/graphql';
import { CreatePedidoInput } from './create-pedido.input';

@InputType()
export class UpdatePedidoInput extends PartialType(CreatePedidoInput) {
  @Field({ nullable: true })
  estado?: string;

  @Field(() => Float, { nullable: true })
  total?: number;
  
  // Si detalles se pudiera actualizar directamente por update, se añadiría aquí,
  // pero tu Pydantic PedidoUpdate no lo incluye.
}