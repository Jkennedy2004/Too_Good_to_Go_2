import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { InventarioProducto } from '../../inventario-producto/entities/inventario-producto.entity';
import { Entrega } from '../../entrega/entities/entrega.entity';

@ObjectType('OfertaReducida')
export class OfertaReducida {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field(() => Float)
  precioReducido: number;

  @Field(() => Int)
  cantidadDisponible: number;

  @Field()
  fechaHoraFinRecogida: string; // Representado como String en GraphQL

  @Field()
  activo: boolean;

  @Field(() => Int)
  inventarioProductoId: number;

  @Field(() => InventarioProducto) // Relación con InventarioProducto
  inventarioProducto: InventarioProducto;

  @Field(() => Entrega, { nullable: true }) // Relación con Entrega, puede ser nula
  entrega?: Entrega | null;

  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;
}