import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioProducto } from './entities/inventario-producto.entity';
import { CreateInventarioProductoDto } from './dto/create-inventario-producto.dto';
import { UpdateInventarioProductoDto } from './dto/update-inventario-producto.dto';

@Injectable()
export class InventarioProductoService {
  constructor(
    @InjectRepository(InventarioProducto)
    private readonly inventarioProductoRepository: Repository<InventarioProducto>,
  ) {}

  async create(
    createInventarioProductoDto: CreateInventarioProductoDto,
  ): Promise<InventarioProducto> {
    const nuevoProducto =
      this.inventarioProductoRepository.create(createInventarioProductoDto);
    return this.inventarioProductoRepository.save(nuevoProducto);
  }

  findAll(): Promise<InventarioProducto[]> {
    return this.inventarioProductoRepository.find({
      relations: ['ofertasReducidas'],
    });
  }

  async findOne(id: number): Promise<InventarioProducto> {
    const producto = await this.inventarioProductoRepository.findOne({
      where: { id },
      relations: ['ofertasReducidas'],
    });
    if (!producto) {
      throw new NotFoundException(
        `Producto de inventario con ID ${id} no encontrado.`,
      );
    }
    return producto;
  }

  async update(
    id: number,
    updateInventarioProductoDto: UpdateInventarioProductoDto,
  ): Promise<InventarioProducto> {
    const producto = await this.inventarioProductoRepository.preload({
      id: id,
      ...updateInventarioProductoDto,
    });

    if (!producto) {
      throw new NotFoundException(
        `Producto de inventario con ID ${id} no encontrado.`,
      );
    }

    return this.inventarioProductoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventarioProductoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Producto de inventario con ID ${id} no encontrado.`,
      );
    }
  }
}