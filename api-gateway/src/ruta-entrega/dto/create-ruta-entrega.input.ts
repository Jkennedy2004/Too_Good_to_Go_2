import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { EstadoRuta } from '../entities/ruta-entrega.entity';

@InputType()
export class CreateRutaEntregaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombreRuta: string;

  @Field(() => EstadoRuta)
  @IsNotEmpty()
  @IsEnum(EstadoRuta)
  estado: EstadoRuta;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  repartidorAsignadoId?: number; // FK al Repartidor
}