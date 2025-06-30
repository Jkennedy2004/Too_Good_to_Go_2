import { Injectable } from '@nestjs/common';
import { CreateRutaEntregaDto } from './dto/create-ruta-entrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-ruta-entrega.dto';

@Injectable()
export class RutaEntregaService {
  create(createRutaEntregaDto: CreateRutaEntregaDto) {
    return 'This action adds a new rutaEntrega';
  }

  findAll() {
    return `This action returns all rutaEntrega`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rutaEntrega`;
  }

  update(id: number, updateRutaEntregaDto: UpdateRutaEntregaDto) {
    return `This action updates a #${id} rutaEntrega`;
  }

  remove(id: number) {
    return `This action removes a #${id} rutaEntrega`;
  }
}
