import {
  IsDateString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEntregaDto {
  @IsDateString()
  @IsNotEmpty()
  fechaEntrega: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  repartidorId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rutaEntregaId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ofertaReducidaId?: number;
}