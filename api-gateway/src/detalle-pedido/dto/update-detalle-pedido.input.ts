// api-gateway/src/detalle-pedido/dto/update-detalle-pedido.input.ts
import { InputType, Field, Float, Int, PartialType } from '@nestjs/graphql';
import { CreateDetallePedidoInput } from './create-detalle-pedido.input';

@InputType()
export class UpdateDetallePedidoInput extends PartialType(CreateDetallePedidoInput) {
  // Aquí puedes añadir campos específicos de actualización si fueran diferentes de los de creación
  // Los campos ya son opcionales por PartialType
}