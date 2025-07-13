import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsISO8601, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateOfertaReducidaInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precioReducido: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidadDisponible: number;

  @Field()
  @IsNotEmpty()
  @IsISO8601()
  fechaHoraFinRecogida: string;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  inventarioProductoId: number; // Necesario para la creación
}