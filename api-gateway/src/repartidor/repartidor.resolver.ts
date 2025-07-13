import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Repartidor } from './entities/repartidor.entity';
import { CreateRepartidorInput } from './dto/create-repartidor.input';
import { UpdateRepartidorInput } from './dto/update-repartidor.input'; 

import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Entrega } from '../entrega/entities/entrega.entity';
import { RutaEntrega } from '../ruta-entrega/entities/ruta-entrega.entity';

const REPARTIDOR_SERVICE_URL = 'http://localhost:3000/repartidores'; // ¡Asegura que esta URL sea correcta!
const ENTREGA_SERVICE_URL = 'http://localhost:3000/entregas'; // URL para el servicio de Entregas
const RUTA_ENTREGA_SERVICE_URL = 'http://localhost:3000/rutas-entrega'; // URL para el servicio de RutaEntrega

@Resolver(() => Repartidor)
export class RepartidorResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [Repartidor], { name: 'repartidores' })
  async findAllRepartidores(): Promise<Repartidor[]> {
    const response = await lastValueFrom(this.httpService.get<Repartidor[]>(REPARTIDOR_SERVICE_URL));
    return response.data;
  }

  @Query(() => Repartidor, { name: 'repartidor' })
  async findOneRepartidor(@Args('id', { type: () => ID }) id: number): Promise<Repartidor> {
    const response = await lastValueFrom(this.httpService.get<Repartidor>(`${REPARTIDOR_SERVICE_URL}/${id}`));
    return response.data;
  }

  @Mutation(() => Repartidor, { name: 'createRepartidor' })
  async createRepartidor(@Args('input') input: CreateRepartidorInput): Promise<Repartidor> {
    const response = await lastValueFrom(this.httpService.post<Repartidor>(REPARTIDOR_SERVICE_URL, input));
    return response.data;
  }

  @Mutation(() => Repartidor, { name: 'updateRepartidor' })
  async updateRepartidor(
    @Args('id', { type: () => ID }) id: number,
    @Args('input') input: UpdateRepartidorInput,
  ): Promise<Repartidor> {
    const response = await lastValueFrom(this.httpService.patch<Repartidor>(`${REPARTIDOR_SERVICE_URL}/${id}`, input));
    return response.data;
  }

  @Mutation(() => Boolean, { name: 'deleteRepartidor' })
  async deleteRepartidor(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await lastValueFrom(this.httpService.delete(`${REPARTIDOR_SERVICE_URL}/${id}`));
    return true;
  }


  @ResolveField(() => [Entrega], { nullable: true })
  async entregas(@Parent() repartidor: Repartidor): Promise<Entrega[]> {
    const response = await lastValueFrom(
      this.httpService.get<Entrega[]>(`${ENTREGA_SERVICE_URL}?repartidorId=${repartidor.id}`)
    );
    return response.data;
  }

  @ResolveField(() => [RutaEntrega], { nullable: true })
  async rutasEntrega(@Parent() repartidor: Repartidor): Promise<RutaEntrega[]> {
    const response = await lastValueFrom(
      this.httpService.get<RutaEntrega[]>(`${RUTA_ENTREGA_SERVICE_URL}?repartidorAsignadoId=${repartidor.id}`)
    );
    return response.data;
  }
}