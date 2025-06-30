import { Injectable } from '@nestjs/common';
import { CreateInventarioProductoDto } from './dto/create-inventario-producto.dto';
import { UpdateInventarioProductoDto } from './dto/update-inventario-producto.dto';

@Injectable()
export class InventarioProductoService {
  create(createInventarioProductoDto: CreateInventarioProductoDto) {
    return 'This action adds a new inventarioProducto';
  }

  findAll() {
    return `This action returns all inventarioProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioProducto`;
  }

  update(id: number, updateInventarioProductoDto: UpdateInventarioProductoDto) {
    return `This action updates a #${id} inventarioProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioProducto`;
  }
}
