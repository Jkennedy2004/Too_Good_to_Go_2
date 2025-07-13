import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entrega } from '../../entrega/entities/entrega.entity';
import { RutaEntrega } from '../../ruta-entrega/entities/ruta-entrega.entity';

@ObjectType('Repartidor')
export class Repartidor {
  @Field(() => ID)
  id: number;

  @Field()
  nombre: string;

  @Field()
  email: string;

  @Field(() => [Entrega], { nullable: true })
  entregas?: Entrega[];

  @Field(() => [RutaEntrega], { nullable: true })
  rutasEntrega?: RutaEntrega[];

  @Field()
  createdAt: string;
  
  @Field()
  updatedAt: string;
}