import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOfertaReducidaInput } from './create-oferta-reducida.input';

@InputType()
export class UpdateOfertaReducidaInput extends PartialType(CreateOfertaReducidaInput) {}