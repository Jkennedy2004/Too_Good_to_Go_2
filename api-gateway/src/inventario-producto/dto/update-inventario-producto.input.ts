import { InputType, PartialType } from '@nestjs/graphql';
import { CreateInventarioProductoInput } from './create-inventario-producto.input';

@InputType()
export class UpdateInventarioProductoInput extends PartialType(CreateInventarioProductoInput) {}