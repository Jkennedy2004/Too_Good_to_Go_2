import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfertaReducidaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  precioReducido: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  cantidadDisponible: number;

  @IsDateString()
  @IsNotEmpty()
  fechaHoraFinRecogida: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  inventarioProductoId: number;
}