import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from './entities/entrega.entity';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';

@Injectable()
export class EntregaService {
  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
  ) {}

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const entrega = this.entregaRepository.create({
      ...createEntregaDto,
      fechaEntrega: new Date(createEntregaDto.fechaEntrega),
    });

    return this.entregaRepository.save(entrega);
  }

  async findAll(): Promise<Entrega[]> {
    return this.entregaRepository.find({
      relations: ['repartidor', 'rutaEntrega', 'ofertaReducida'],
    });
  }

  async findOne(id: number): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({
      where: { id },
      relations: ['repartidor', 'rutaEntrega', 'ofertaReducida'],
    });

    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }

    return entrega;
  }

  async update(id: number, updateData: UpdateEntregaDto): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({
      where: { id },
      relations: ['repartidor', 'rutaEntrega', 'ofertaReducida'],
    });

    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }

    Object.assign(entrega, {
      ...updateData,
      ...(updateData.fechaEntrega && {
        fechaEntrega: new Date(updateData.fechaEntrega),
      }),
    });

    return this.entregaRepository.save(entrega);
  }

  async remove(id: number): Promise<void> {
    const entrega = await this.entregaRepository.findOne({ where: { id } });

    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }

    await this.entregaRepository.remove(entrega);
  }
}
