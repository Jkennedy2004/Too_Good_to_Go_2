import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Repartidor } from '../../repartidor/entities/repartidor.entity';
import { Entrega } from '../../entrega/entities/entrega.entity';

export enum EstadoRuta {
  PLANIFICADA = 'PLANIFICADA',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}

registerEnumType(EstadoRuta, {
  name: 'EstadoRuta',
  description: 'Estado actual de la ruta de entrega',
});

@ObjectType('RutaEntrega')
export class RutaEntrega {
  @Field(() => ID)
  id: number;

  @Field()
  nombreRuta: string;

  @Field(() => EstadoRuta)
  estado: EstadoRuta;

  @Field(() => Repartidor, { nullable: true }) // Relación con Repartidor
  repartidorAsignado?: Repartidor | null;

  @Field(() => [Entrega], { nullable: true })
  entregas?: Entrega[];

  @Field()
  createdAt: string;
  @Field()
  updatedAt: string;
}