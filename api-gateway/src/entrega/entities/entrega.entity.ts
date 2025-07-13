import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Repartidor } from '../../repartidor/entities/repartidor.entity';
import { OfertaReducida } from '../../oferta-reducida/entities/oferta-reducida.entity';
import { RutaEntrega } from '../../ruta-entrega/entities/ruta-entrega.entity';

@ObjectType('Entrega')
export class Entrega {
  @Field(() => ID)
  id: number;

  @Field()
  fechaEntrega: string; // Representado como String

  @Field(() => Repartidor, { nullable: true }) // Relación con Repartidor
  repartidor?: Repartidor | null;

  @Field(() => RutaEntrega, { nullable: true }) // Relación con RutaEntrega
  rutaEntrega?: RutaEntrega | null;

  @Field(() => OfertaReducida, { nullable: true }) // Relación OneToOne con OfertaReducida
  ofertaReducida?: OfertaReducida | null;

  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;
}