import { PartialType } from '@nestjs/mapped-types';
import { CreateOfertaReducidaDto } from './create-oferta-reducida.dto';

export class UpdateOfertaReducidaDto extends PartialType(
  CreateOfertaReducidaDto,
) {}