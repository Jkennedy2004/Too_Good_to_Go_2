import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { OfertaReducida } from '../../oferta-reducida/entities/oferta-reducida.entity';

@ObjectType('InventarioProducto')
export class InventarioProducto {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field(() => Int)
  cantidadActual: number;

  @Field()
  activo: boolean;

 
  @Field(() => [OfertaReducida], { nullable: true })
  ofertasReducidas?: OfertaReducida[];

  @Field()
  createdAt: string;
  
  @Field()
  updatedAt: string;
}