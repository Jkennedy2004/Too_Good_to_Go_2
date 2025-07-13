import { InputType, PartialType } from '@nestjs/graphql';
import { CreateEntregaInput } from './create-entrega.input';

@InputType()
export class UpdateEntregaInput extends PartialType(CreateEntregaInput) {}