import { Injectable } from '@nestjs/common';
import { CreateOfertaReducidaDto } from './dto/create-oferta-reducida.dto';
import { UpdateOfertaReducidaDto } from './dto/update-oferta-reducida.dto';

@Injectable()
export class OfertaReducidaService {
  create(createOfertaReducidaDto: CreateOfertaReducidaDto) {
    return 'This action adds a new ofertaReducida';
  }

  findAll() {
    return `This action returns all ofertaReducida`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ofertaReducida`;
  }

  update(id: number, updateOfertaReducidaDto: UpdateOfertaReducidaDto) {
    return `This action updates a #${id} ofertaReducida`;
  }

  remove(id: number) {
    return `This action removes a #${id} ofertaReducida`;
  }
}
