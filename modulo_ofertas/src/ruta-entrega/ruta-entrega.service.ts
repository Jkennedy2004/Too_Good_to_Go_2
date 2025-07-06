import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaEntrega } from './entities/ruta-entrega.entity';
import { CreateRutaEntregaDto } from './dto/create-ruta-entrega.dto';
import { UpdateRutaEntregaDto } from './dto/update-ruta-entrega.dto';
import { Repartidor } from '../repartidor/entities/repartidor.entity';
// Si tu servicio de RutaEntrega también gestiona entregas, asegúrate de que esta importación sea correcta:
// import { Entrega } from '../entrega/entities/entrega.entity';


@Injectable()
export class RutaEntregaService {
  constructor(
    @InjectRepository(RutaEntrega)
    private readonly rutaEntregaRepository: Repository<RutaEntrega>,
    @InjectRepository(Repartidor)
    private readonly repartidorRepository: Repository<Repartidor>,
    // Si usas Entrega en este servicio, inyecta su repositorio aquí:
    // @InjectRepository(Entrega)
    // private readonly entregaRepository: Repository<Entrega>,
  ) {}

  async create(createRutaEntregaDto: CreateRutaEntregaDto): Promise<RutaEntrega> {
    const { repartidorAsignadoId, ...rutaData } = createRutaEntregaDto;

    const nuevaRuta = this.rutaEntregaRepository.create(rutaData);

    if (repartidorAsignadoId) {
      const repartidor = await this.repartidorRepository.findOneBy({
        id: repartidorAsignadoId,
      });
      if (!repartidor) {
        throw new NotFoundException(
          `Repartidor con ID ${repartidorAsignadoId} no encontrado.`,
        );
      }
      nuevaRuta.repartidorAsignado = repartidor;
    }

    return this.rutaEntregaRepository.save(nuevaRuta);
  }

  findAll(): Promise<RutaEntrega[]> {
    return this.rutaEntregaRepository.find({
      relations: ['repartidorAsignado', 'entregas'],
    });
  }

  async findOne(id: number): Promise<RutaEntrega> {
    const ruta = await this.rutaEntregaRepository.findOne({
      where: { id },
      relations: ['repartidorAsignado', 'entregas'],
    });
    if (!ruta) {
      throw new NotFoundException(`Ruta de Entrega con ID ${id} no encontrada.`);
    }
    return ruta;
  }

  async update(id: number, updateRutaEntregaDto: UpdateRutaEntregaDto): Promise<RutaEntrega> {
    const ruta = await this.rutaEntregaRepository.preload({ id: id });

    if (!ruta) {
      throw new NotFoundException(`Ruta de Entrega con ID ${id} no encontrada.`);
    }

    const { repartidorAsignadoId, ...updateData } = updateRutaEntregaDto;

    if (repartidorAsignadoId !== undefined) {
      if (repartidorAsignadoId === null) {
        ruta.repartidorAsignado = null;
      } else {
        const repartidor = await this.repartidorRepository.findOneBy({
          id: repartidorAsignadoId,
        });
        if (!repartidor) {
          throw new NotFoundException(
            `Repartidor con ID ${repartidorAsignadoId} no encontrado.`,
          );
        }
        ruta.repartidorAsignado = repartidor;
      }
    }

    Object.assign(ruta, updateData);

    return this.rutaEntregaRepository.save(ruta);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rutaEntregaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ruta de Entrega con ID ${id} no encontrada.`);
    }
  }
}