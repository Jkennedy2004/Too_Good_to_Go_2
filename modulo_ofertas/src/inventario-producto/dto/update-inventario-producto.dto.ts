import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioProductoDto } from './create-inventario-producto.dto';

export class UpdateInventarioProductoDto extends PartialType(CreateInventarioProductoDto) {}
