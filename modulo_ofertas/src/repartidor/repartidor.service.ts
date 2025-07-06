import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repartidor } from './entities/repartidor.entity';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';

@Injectable()
export class RepartidorService {
  constructor(
    @InjectRepository(Repartidor)
    private readonly repartidorRepository: Repository<Repartidor>,
  ) {}

  create(createRepartidorDto: CreateRepartidorDto): Promise<Repartidor> {
    const nuevoRepartidor =
      this.repartidorRepository.create(createRepartidorDto);
    return this.repartidorRepository.save(nuevoRepartidor);
  }

  findAll(): Promise<Repartidor[]> {
    return this.repartidorRepository.find({
      relations: ['entregas', 'rutasEntrega'],
    });
  }

  async findOne(id: number): Promise<Repartidor> {
    const repartidor = await this.repartidorRepository.findOne({
      where: { id },
      relations: ['entregas', 'rutasEntrega'],
    });
    if (!repartidor) {
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`);
    }
    return repartidor;
  }

  async update(
    id: number,
    updateRepartidorDto: UpdateRepartidorDto,
  ): Promise<Repartidor> {
    const repartidor = await this.repartidorRepository.preload({
      id: id,
      ...updateRepartidorDto,
    });
    if (!repartidor) {
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`);
    }
    return this.repartidorRepository.save(repartidor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repartidorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Repartidor con ID ${id} no encontrado.`);
    }
  }
}