import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRepartidorInput } from './create-repartidor.input';

@InputType()
export class UpdateRepartidorInput extends PartialType(CreateRepartidorInput) {}