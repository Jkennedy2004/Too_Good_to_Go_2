import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsISO8601, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateEntregaInput {
  @Field()
  @IsNotEmpty()
  @IsISO8601()
  fechaEntrega: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  repartidorId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  rutaEntregaId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  ofertaReducidaId?: number; // Asegúrate de que este campo sea único si la relación es OneToOne
}