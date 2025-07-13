import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRutaEntregaInput } from './create-ruta-entrega.input';

@InputType()
export class UpdateRutaEntregaInput extends PartialType(CreateRutaEntregaInput) {}