import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoRuta } from '../entities/ruta-entrega.entity';

export class CreateRutaEntregaDto {
  @IsString()
  @IsNotEmpty()
  nombreRuta: string;

  @IsDateString()
  @IsNotEmpty()
  fechaRuta: string; // Se recibe como string y se convierte a Date

  @IsOptional()
  @IsEnum(EstadoRuta)
  estado?: EstadoRuta;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  kilometrajeEstimado?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  repartidorAsignadoId?: number;
}