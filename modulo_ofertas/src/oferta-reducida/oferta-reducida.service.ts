import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfertaReducida } from './entities/oferta-reducida.entity';
import { CreateOfertaReducidaDto } from './dto/create-oferta-reducida.dto';
import { UpdateOfertaReducidaDto } from './dto/update-oferta-reducida.dto';
import { InventarioProducto } from '../inventario-producto/entities/inventario-producto.entity';
import { Entrega } from '../entrega/entities/entrega.entity';

@Injectable()
export class OfertaReducidaService {
  constructor(
    @InjectRepository(OfertaReducida)
    private readonly ofertaReducidaRepository: Repository<OfertaReducida>,
    @InjectRepository(InventarioProducto)
    private readonly inventarioProductoRepository: Repository<InventarioProducto>,
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
  ) {}

  async create(
    createOfertaReducidaDto: CreateOfertaReducidaDto,
  ): Promise<OfertaReducida> {
    const { inventarioProductoId, fechaHoraFinRecogida, ...ofertaData } =
      createOfertaReducidaDto;

    const inventarioProducto = await this.inventarioProductoRepository.findOneBy(
      { id: inventarioProductoId },
    );
    if (!inventarioProducto) {
      throw new NotFoundException(
        `Producto de inventario con ID ${inventarioProductoId} no encontrado.`,
      );
    }

    const nuevaOferta = this.ofertaReducidaRepository.create({
      ...ofertaData,
      inventarioProducto: inventarioProducto,
      fechaHoraFinRecogida: new Date(fechaHoraFinRecogida),
    });

    return this.ofertaReducidaRepository.save(nuevaOferta);
  }

  findAll(): Promise<OfertaReducida[]> {
    return this.ofertaReducidaRepository.find({
      relations: ['inventarioProducto', 'entrega'],
    });
  }

  async findOne(id: number): Promise<OfertaReducida> {
    const oferta = await this.ofertaReducidaRepository.findOne({
      where: { id },
      relations: ['inventarioProducto', 'entrega'],
    });
    if (!oferta) {
      throw new NotFoundException(`Oferta Reducida con ID ${id} no encontrada.`);
    }
    return oferta;
  }

  async update(
    id: number,
    updateOfertaReducidaDto: UpdateOfertaReducidaDto,
  ): Promise<OfertaReducida> {
    const oferta = await this.ofertaReducidaRepository.preload({
      id: id,
      ...updateOfertaReducidaDto,
      ...(updateOfertaReducidaDto.fechaHoraFinRecogida && {
        fechaHoraFinRecogida: new Date(
          updateOfertaReducidaDto.fechaHoraFinRecogida,
        ),
      }),
    });

    if (!oferta) {
      throw new NotFoundException(`Oferta Reducida con ID ${id} no encontrada.`);
    }

    if (updateOfertaReducidaDto.inventarioProductoId !== undefined) {
      const inventarioProducto =
        await this.inventarioProductoRepository.findOneBy({
          id: updateOfertaReducidaDto.inventarioProductoId,
        });
      if (!inventarioProducto) {
        throw new NotFoundException(
          `Producto de inventario con ID ${updateOfertaReducidaDto.inventarioProductoId} no encontrado.`,
        );
      }
      oferta.inventarioProducto = inventarioProducto;
    }

    return this.ofertaReducidaRepository.save(oferta);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ofertaReducidaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Oferta Reducida con ID ${id} no encontrada.`);
    }
  }
}